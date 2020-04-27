# Password generator

Browser based passphrase generator. Runs entirely in the web browser and uses the [EFF word lists](https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases).

[![Netlify Status](https://api.netlify.com/api/v1/badges/7eecd76e-39df-47db-84a1-26abaa5c93dd/deploy-status)](https://app.netlify.com/sites/p4ss/deploys)

- [Live demo hosted by Netlify](https://p4ss.netlify.app)

## Tools used

- [Parcel](https://parceljs.org/) / [github](https://github.com/parcel-bundler/parcel) + [docs](https://parceljs.org/getting_started.html)
- [EFF word lists](https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases)

## Development process

Install depedencies

    npm install

Development build and serve:

    npm run start

Production build (files saved in `dist/`):

    npm run build

This will perform a `rm -rf dist && ./node_modules/.bin/parcel build index.html --no-minify`. To use relative paths or a different absolute path to your assets other than `/`, you may want to use `---public-url /your-path/`

Static files are available in `dist/`

Do not view `/index.html` in the browser, it will not work. Use packaged files in the `dist/` directory.

## Use of `window.location.hash`

This makes it bookmark-friendly with user-selected parameters recallable. The formats supported are:

    #/:words
    #/:words/:passphrases
    #/:words/:passphrases/:wordlist

e.g

    http://localhost:1234/#/4/10/eff-short1

If no hash is present, default parameters are used.
