# rp-vicki — rpdiscoverer.com

Source for the **RP Discoverer** website (`https://www.rpdiscoverer.com`).

Static HTML/CSS/JS with no build step. Everything under `src/` is served
exactly as written.

## How a change goes live

1. Edit files under `src/`.
2. Commit and push to `main`.
3. `.github/workflows/deploy.yml` zips `src/` and pushes it to AWS Amplify.

That is the whole loop — save to GitHub, the site updates. No local AWS
credentials are needed to publish; the workflow gets short-lived credentials
from GitHub OIDC.

To republish without a content change, run the **Deploy to Amplify** workflow
manually from the Actions tab (`workflow_dispatch`).

## Layout

```
src/
  index.html      Home page — the only real page today
  404.html        Served for any unmatched path (Amplify custom rule)
  css/site.css    All styling, single file
  js/config.js    Runtime config; where the signup endpoint gets switched on
  js/site.js      Footer year + signup form handling
  favicon.svg     Tab icon
  robots.txt
  sitemap.xml
.github/
  workflows/deploy.yml   Push to main -> Amplify
  dependabot.yml         Monthly grouped bumps for the pinned actions
infra/README.md   What exists in AWS, and what does not yet
```

## Previewing locally

```bash
python3 -m http.server 8080 --directory src
```

Then open `http://localhost:8080`.

## Content status

The copy is real product copy for RP (Right Plan Discoverer), carried over from
the RP section of softwarebydaw.com so the two sites say the same things about
the same product. Two blocks are deliberate placeholders and should be replaced
before the site is promoted anywhere:

- The **announcement bar** at the top of `index.html`.
- The three **"What's happening now"** cards, which describe the release,
  validation report, and Agency edition in general terms rather than naming a
  version or linking to a specific report.

Contact addresses currently point at `support@softwarebydaw.com`, because no
mailbox exists on the `rpdiscoverer.com` domain. Change them if that changes.

## Mailing list

The signup form on the home page collects an email address, an optional name,
an interest category, and an optional note.

**There is no backend yet.** Submitting opens a prefilled `mailto:` and the
form says plainly that nothing was stored — a static site cannot store a
contact, and the form should not imply otherwise. See `infra/README.md` for the
planned collection path and what it needs (consent wording, unsubscribe, and a
privacy note) before it handles real addresses.

## Legal note

RP is planning software, not financial, tax, or legal advice. Copy on this site
should keep that distinction; the footer states it on every page.
