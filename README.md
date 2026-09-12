# rp-vicki — Austin Area Firewise Alliance website

Source for the Austin Area Firewise Alliance site, served at
`https://www.rpdiscoverer.com`.

Wildfire preparedness for neighborhoods across Travis County, Texas. Static
HTML/CSS/JS with no build step — everything under `src/` is served exactly as
written.

## How a change goes live

1. Edit files under `src/`.
2. Commit and push to `main`.
3. `.github/workflows/deploy.yml` zips `src/` and pushes it to AWS Amplify.

That is the whole loop: save to GitHub, the site updates. No local AWS
credentials are needed to publish — the workflow gets short-lived credentials
from GitHub OIDC. To republish without a content change, run the **Deploy to
Amplify** workflow from the Actions tab.

## Pages

| File | Covers |
| --- | --- |
| `index.html` | Home — conditions, quick actions, the five highest-value tasks, live condition feeds, what the Alliance does, signup/contact |
| `prepare-your-home.html` | Ember behavior, defensible space zones 0–5 / 5–30 / 30–100 ft, home hardening, landscaping and brush disposal |
| `firewise-communities.html` | What Firewise USA® is, the six steps to recognition, AFD vs. ESD coverage, keeping a site alive after year one |
| `evacuation.html` | Alerts and STEAR, Ready/Set/Go, go-bag contents, streets with one way out, returning afterward |
| `about.html` | Who the Alliance is, where it works, how to get involved, sources for the guidance |
| `404.html` | Served for unmatched paths |

Shared shell (emergency strip, header, footer) is repeated in each file rather
than templated. That is deliberate for a no-build static site, but it means a
change to the header or footer is a change to **every** page — check them all.

## Previewing locally

```bash
python3 -m http.server 8080 --directory src
```

Then open `http://localhost:8080`.

## Editing rules worth keeping

These are not style preferences; they are why the site is safe to publish.

- **The site speaks as the Alliance, never as an agency.** It is an
  independent volunteer organization, not the City of Austin, AFD, Travis
  County, or an ESD. Every page footer says so. Do not write copy that reads
  as an official notice, and do not reproduce agency branding.
- **Emergency instructions belong to the agencies.** The 911 line is first in
  the DOM on every page. Links to Warn Central Texas, the Fire Marshal, TDEM,
  and the Forest Service go to those agencies directly, marked with `.ext`.
- **Don't publish perishable facts.** The conditions banner deliberately says
  "burn ban status changes — check the county's current order" rather than
  asserting a status, because a stale "no burn ban in effect" on a wildfire
  site is worse than no banner. Same reasoning for incident news.
- **The contact form is not an emergency channel** and says so above the
  fields. Do not soften that.
- **Guidance follows NFPA / Firewise USA® and state practice.** If you change
  a number — zone distances, vent mesh size, branch clearance — check it
  against the source first.

## Contact address and mailing list

Both are switched on in `src/js/config.js`, and both are off right now.

- `window.AAFA_CONTACT_EMAIL` is `null`, so the site renders **no** mailto
  links. Set it to the Alliance's real address once a mailbox exists.
- `window.AAFA_SIGNUP_ENDPOINT` is unset, so the form stores nothing and says
  so plainly, pointing at official channels instead.

See `infra/README.md` for the planned collection path and what it needs —
double opt-in, unsubscribe, CORS, rate limiting, a privacy statement — before
it handles a real address.

## Brand assets

`src/img/` holds the Alliance logo and wordmark, copied from `~/firewise/`.
The logo is the favicon and the header mark.

## Trademark

Firewise USA® is a registered program of the National Fire Protection
Association. The site describes the program and links to NFPA; it does not
claim to speak for it.
