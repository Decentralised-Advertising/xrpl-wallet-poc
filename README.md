# XRPL Wallet POC

Work-in-progress XRPL Wallet Browser Extension POC built using React which leverages https://github.com/Decentralised-Advertising/xrpl-components

## Installing and using the POC

This repo is set up to build the POC in CI, and produce an artifact which is ready for you to install in your Chrome/Brave/Edge Browser.

You can see and download the artifact if you visit the bottom of the Github Actions UI for a specific run, e.g. https://github.com/Decentralised-Advertising/xrpl-wallet-poc/actions/runs/2054669664

(Alternatively you can build the artifact from source by following the section below).

Once you have the artifact, open your extensions URL:

E.g.

```
chrome://extensions/
```

OR

```
brave://extensions/
```

And enable "Developer Mode" on the top right. With that enabled you will now be able to click on "Load unpacked" and choose the folder from your file system

- If you have built from source, you should choose the `dist/apps/browser-extension/unpacked` directory within your clone of the repo
- If you have downloaded from the CI pipeline, you will choose the the root directory of the unzipped folder (also called "unpacked")

The extension will now be available in your browser alongside any you might have installed from the chrome store!

## Building the POC

In order to build the POC from source you can clone this repo, then run the following from the root:

```sh
# Install all dependencies
yarn

# Build the browser extension ready to be installed
npx ts-node --project=tools/tsconfig.tools.json tools/utils/build-browser-extension.ts
```

The artifact you need is now available in `dist/apps/browser-extension/unpacked` and you can following the instructions in the "Installing and using the POC" section above.
