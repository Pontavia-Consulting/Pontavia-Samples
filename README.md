# Pontavia Consulting — website package samples

A single page comparing the three Pontavia Consulting website packages (Good, Better, Best),
using the same made-up business, **Fern & Field Garden Co.**, built at each level.

Live page: https://pontavia-consulting.github.io/pontavia-samples/

| Package | Live demo | Code |
| --- | --- | --- |
| Good ($950) | https://pontavia-consulting.github.io/pontavia-sample-good/ | [pontavia-sample-good](https://github.com/Pontavia-Consulting/pontavia-sample-good) |
| Better ($1,875) | https://pontavia-consulting.github.io/pontavia-sample-better/ | [pontavia-sample-better](https://github.com/Pontavia-Consulting/pontavia-sample-better) |
| Best (from $3,100) | https://pontavia-consulting.github.io/pontavia-sample-best/ | [pontavia-sample-best](https://github.com/Pontavia-Consulting/pontavia-sample-best) |

## Files

- `index.html` — the whole page (styles and script inline)
- `renders/` — WebP screenshots of the sample sites (2x, 1366×860 desktop and 390×844 phone)
- `assets/` — Pontavia logo mark, favicon, and self-hosted fonts (Plus Jakarta Sans, Inter; SIL OFL)

## Updating prices

Prices and founding-client prices are written into `index.html` (hero, each package section,
the comparison table header and the note under "Why the price steps up"). If the pricing page
on pontaviaconsulting.com changes, update those spots to match. When the founding offer ends,
delete the three `<p class="founding">` lines and the founding sentence in the note.
