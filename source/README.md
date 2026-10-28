# Source for the three Fern & Field sample sites

The Good, Better and Best repos contain plain static HTML. This folder is the small generator
that produces all three from one set of content, so a change (a price, a phone number, a new
plant) only has to be made once.

## Layout

| File | What it is |
| --- | --- |
| `data.js` | All content: plants, services, workshops, team, reviews, hours. Used by the build and by the browser. |
| `art.js` | Draws every plant illustration as SVG (no stock photos). |
| `base.css` / `plus.css` / `store.css` | Styles. Good uses base; Better adds plus; Best adds store. |
| `core.js` / `plus.js` / `store.js` | Behavior. Same layering as the CSS. |
| `pages_common.py` | Shared header, footer, SEO tags, URLs. |
| `pages_good.py` / `pages_better.py` / `pages_best.py` | Page content for each package. |
| `build.py` | Writes the sites to `../good`, `../better`, `../best`. |
| `renders.py` / `shot.py` | Screenshot helpers (Playwright) for the samples page. They serve from `/home/claude/samples`; edit the paths at the top for your machine. |

## Rebuild

Needs Python 3.12+ and Node (the build reads `data.js` with Node).

```
mkdir work && cp -r source work/src && cd work/src
python3 build.py            # or: python3 build.py best
```

Then copy `work/good`, `work/better`, `work/best` into the matching repos and push.
