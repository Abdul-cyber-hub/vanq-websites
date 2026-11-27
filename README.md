# VANQ: Build beyond boundaries.

Static website for vanqtech.com with a 3D power core (Three.js), a locked project vault and contact section. No build step.

## Structure
```
VANQ/
  index.html
  CNAME
  README.md
  css/tokens.css   design tokens (colors)
  css/styles.css   layout and components
  js/reactor.js    3D power core scene
  js/main.js       project vault, payment and unlock logic
```
Three.js r128 loads from cdnjs, and fonts load from Google Fonts, so the visitor needs an internet connection.

## Run locally
Open `index.html` in a browser. The vault unlock needs a secure page, so for a full test run `python3 -m http.server` in this folder and open http://localhost:8000.

## Deploy on GitHub Pages
1. Create a new GitHub repository (for example `vanq`) and upload everything in this folder to the repository root, including `CNAME` and `.nojekyll`.
2. In the repository open Settings, then Pages. Under Source choose "Deploy from a branch", branch `main`, folder `/ (root)`, then Save.
3. Under Custom domain enter `vanqtech.com` (the CNAME file already contains it) and tick Enforce HTTPS once it becomes available.

## Connect vanqtech.com (DNS at your domain provider)
Add these records, then wait for DNS to update (minutes to a few hours):
- Four `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- One `CNAME` record for `www` pointing to `YOUR-GITHUB-USERNAME.github.io`

Check GitHub's current custom domain guide in case these values change.

## Payment settings
At the top of `js/main.js`, set `UPI_ID` to your UPI ID (for example `name@bank`). Until then the pay button opens WhatsApp to your number. After you confirm a payment, send the buyer the unlock code. The project ideas are stored encrypted in `js/main.js`, so the repository does not expose them.
