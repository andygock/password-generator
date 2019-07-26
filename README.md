# Password generator

Browser based *secure-enough* passphrase generator. Runs entirely in the web browser and uses the [EFF word lists](https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases).

Demo available at <https://gock.net/pass>

## Tools used

- [Parcel](https://parceljs.org/)
- [mini.css](https://minicss.org/docs/)
- [EFF word lists](https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases).

## Development process

Requires global install of parceljs, you can do this with `npm install -g parcel-bundler`

Install depedencies (only `mini.css`)

    npm install

Development build and serve:

    npm run start

Production build:

    npm run build

This will perform a `rm -rf dist && parcel build index.html --no-minify`. To use relative paths or a different absolute path to your assets other than `/`, you may want to use `---public-url /your-path/`

Static files are available in `dist/`

Do not view `/index.html` in the browser, it will not work. Use packaged files in the `dist/` directory.

## Use of location.hash

This makes it bookmark friendly with user-selected parameters recallable. The formats supported are:

    #/:words
    #/:words/:passphrases
    #/:words/:passphrases/:wordlist

e.g

    http://localhost:1234/#/4/10/eff-short1

If no hash is present, default parameters are used.
