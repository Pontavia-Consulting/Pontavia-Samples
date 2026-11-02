#!/usr/bin/env bash
# Shared helpers for the LXC install scripts. Run the numbered scripts on the Proxmox node (prox2) as root.
set -euo pipefail

NODE_EXPECTED="prox2"
TEMPLATE="local:vztmpl/debian-13-standard_13.6-1_amd64.tar.zst"
STORAGE="local-lvm"
BRIDGE="vmbr0"
GATEWAY="10.0.1.1"
DNS="10.0.1.3"                # Pi-hole
TZ_NAME="America/New_York"

say()  { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }
ok()   { printf '\033[1;32m  ok:\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m  !!\033[0m %s\n' "$*"; }
die()  { printf '\033[1;31mERROR:\033[0m %s\n' "$*" >&2; exit 1; }

preflight() {   # preflight <ctid> <ip>
  local id=$1 ip=$2
  [[ $EUID -eq 0 ]] || die "run as root on the Proxmox node"
  command -v pct >/dev/null || die "pct not found: run this on the Proxmox node, not inside a container"
  [[ $(hostname) == "$NODE_EXPECTED" ]] || warn "this host is $(hostname), scripts were planned for $NODE_EXPECTED"
  if pct status "$id" >/dev/null 2>&1 || qm status "$id" >/dev/null 2>&1; then
    die "ID $id is already in use. Pick another CTID at the top of the script."
  fi
  if ping -c1 -W1 "$ip" >/dev/null 2>&1; then
    die "$ip already answers ping. Pick another IP at the top of the script."
  fi
  pveam list local | grep -q "${TEMPLATE##*/}" || die "template ${TEMPLATE##*/} missing (pveam download local ${TEMPLATE##*/})"
  ok "ID $id and IP $ip are free"
}

# create_ct <ctid> <hostname> <ip> <cores> <memMB> <diskGB> <tags> <description> [tun]
create_ct() {
  local id=$1 name=$2 ip=$3 cores=$4 mem=$5 disk=$6 tags=$7 desc=$8 tun=${9:-}
  say "Creating CT $id ($name) at $ip"
  pct create "$id" "$TEMPLATE" \
    --hostname "$name" --cores "$cores" --memory "$mem" --swap 512 \
    --rootfs "$STORAGE:$disk" \
    --net0 "name=eth0,bridge=$BRIDGE,firewall=1,gw=$GATEWAY,ip=$ip/24,type=veth" \
    --nameserver "$DNS" --timezone "$TZ_NAME" \
    --unprivileged 1 --features nesting=1,keyctl=1 --onboot 1 \
    --tags "$tags" --description "$desc"
  if [[ $tun == tun ]]; then
    cat >>"/etc/pve/lxc/$id.conf" <<'EOF'
lxc.cgroup2.devices.allow: c 10:200 rwm
lxc.mount.entry: /dev/net/tun dev/net/tun none bind,create=file
EOF
    ok "TUN device passed through"
  fi
  pct start "$id"
  for _ in $(seq 1 30); do
    pct exec "$id" -- ping -c1 -W1 deb.debian.org >/dev/null 2>&1 && break
    sleep 2
  done
  pct exec "$id" -- ping -c1 -W2 deb.debian.org >/dev/null 2>&1 || die "CT $id has no internet after 60s"
  ok "CT $id is up with internet"
  in_ct "$id" 'export DEBIAN_FRONTEND=noninteractive
    apt-get update -qq && apt-get -y -qq full-upgrade >/dev/null
    apt-get -y -qq install curl ca-certificates gnupg jq unattended-upgrades >/dev/null
    echo "unattended-upgrades unattended-upgrades/enable_auto_updates boolean true" | debconf-set-selections
    dpkg-reconfigure -f noninteractive unattended-upgrades'
  ok "base packages + automatic security updates"
}

in_ct() {       # in_ct <ctid> <bash script>
  # C.UTF-8 is built in; avoids perl/apt locale warnings when your SSH session sends en_US.UTF-8
  pct exec "$1" -- env LANG=C.UTF-8 LC_ALL=C.UTF-8 PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin bash -euo pipefail -c "$2"
}

install_docker() {   # Docker's official repo, same as CT 137
  in_ct "$1" 'install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc
    . /etc/os-release
    echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $VERSION_CODENAME stable" > /etc/apt/sources.list.d/docker.list
    apt-get update -qq
    DEBIAN_FRONTEND=noninteractive apt-get -y -qq install docker-ce docker-ce-cli containerd.io docker-compose-plugin >/dev/null
    systemctl enable --now docker >/dev/null
    docker compose version'
  ok "Docker installed"
}

push_file() {   # push_file <ctid> <dest path> <mode>   (content on stdin)
  local tmp; tmp=$(mktemp)
  cat >"$tmp"
  pct push "$1" "$tmp" "$2" --perms "$3"
  rm -f "$tmp"
}


backup_job_hint() { ok "CT $1 is covered by the nightly 03:30 backup job"; }
#!/usr/bin/env bash
# CT 146 "docuseal": Pontavia's contract e-signing (self-hosted DocuSeal, Docker).
# Clients sign here; n8n creates the contract from a template and gets a webhook when it is signed.
#
# Run on prox2 as root

CTID=146
NAME=docuseal
IP=10.0.1.239
HOSTNAME_PUBLIC=sign.pontaviaconsulting.com     # the Cloudflare tunnel hostname you'll point at $IP:3000

preflight "$CTID" "$IP"
create_ct "$CTID" "$NAME" "$IP" 2 2048 10 "pontavia;contracts" \
  "Pontavia DocuSeal e-signature (Docker, :3000). Public URL https://$HOSTNAME_PUBLIC via Cloudflare tunnel. Built by homelab/lxc/80-docuseal.sh"
install_docker "$CTID"

say "Writing compose file"
in_ct "$CTID" 'mkdir -p /opt/docuseal/data /opt/docuseal/backups; apt-get -y -qq install sqlite3 >/dev/null'
push_file "$CTID" /opt/docuseal/docker-compose.yml 0644 <<EOT
# Pontavia DocuSeal. Update: docker compose pull && docker compose up -d
services:
  docuseal:
    image: docuseal/docuseal:latest
    container_name: docuseal
    environment:
      - FORCE_SSL=$HOSTNAME_PUBLIC
      - TZ=$TZ_NAME
    volumes:
      - ./data:/data
    ports:
      - "$IP:3000:3000"
    restart: unless-stopped
EOT
in_ct "$CTID" "cd /opt/docuseal
  docker compose up -d
  for _ in \$(seq 1 30); do curl -fsS -o /dev/null http://$IP:3000/ && break; sleep 3; done
  curl -sS -o /dev/null -w 'docuseal answers HTTP %{http_code}\n' http://$IP:3000/"

say "Nightly local backup (02:40, kept 14 days); the 03:30 Proxmox job backs up the whole CT to Unraid"
push_file "$CTID" /usr/local/sbin/docuseal-backup 0700 <<'EOT'
#!/bin/bash
# Consistent copy of the DocuSeal database + uploaded and signed documents (signed PDFs are your contract records).
set -euo pipefail
D=/opt/docuseal; B=$D/backups; S=$(date +%F)
DB=$(find "$D/data" -maxdepth 2 -name 'docuseal.db' -o -maxdepth 2 -name 'db.sqlite3' | head -1)
[ -n "$DB" ] && sqlite3 "$DB" ".backup '$B/db-$S.sqlite3'"
tar -czf "$B/files-$S.tgz" -C "$D/data" --exclude='*.sqlite3*' --exclude='docuseal.db*' . 2>/dev/null || true
find "$B" -type f -mtime +14 -delete
EOT
in_ct "$CTID" 'echo "40 2 * * * root /usr/local/sbin/docuseal-backup" > /etc/cron.d/docuseal-backup'
ok "backup cron installed"

cat <<EOF

Next:
  1. Cloudflare Zero Trust > Networks > Tunnels > your tunnel > Public hostnames > Add:
       $HOSTNAME_PUBLIC  ->  http://$IP:3000
     Do NOT put Cloudflare Access on the whole hostname: clients need to open their signing links without logging in.
  2. Open https://$HOSTNAME_PUBLIC and create the admin account (admin@pontaviaconsulting.com). The first account is the owner.
  3. Settings > Email (SMTP): use the Pontavia SMTP login so signing emails come from a pontaviaconsulting.com address.
     Send yourself a test and check it does not land in spam.
  4. Settings > API: copy the API token. Tell Claude: it goes straight into an n8n credential, then ask for the template build.
  5. Pi-hole Local DNS: docuseal.lan -> $IP   (add the Cloudflare hostname above to Homepage and Uptime Kuma)
EOF
