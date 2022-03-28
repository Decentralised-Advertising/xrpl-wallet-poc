/* eslint-disable @typescript-eslint/no-var-requires */
const getWebpackConfig = require('@nrwl/react/plugins/webpack');
const { IgnorePlugin, ProvidePlugin } = require('webpack');

module.exports = (config) => {
  config = getWebpackConfig(config);

  config.node = config.node || {};
  config.node.global = true;

  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
    https: false,
    net: false,
    tls: false,
  };

  // Remove the non-English word-lists from the bip39 library used for mnemonic generation
  config.plugins.push(
    new IgnorePlugin({
      resourceRegExp: /^\.\/wordlists\/(?!english)/,
      contextRegExp: /bip39\/src$/,
    })
  );

  config.plugins.push(
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  );

  // We have an extra HTML document available to preview popup.html via an iframe
  if (process.env.NODE_ENV !== 'production') {
    console.log(`
================================================================================================

  DA DEVELOPMENT NOTE:

  An extra /popup-preview.html is available which renders the popup app in an iframe to give a more realistic set of constraints when developing.

  Simply create the full static path for apps/browser-extension/popup/src/popup-preview.html (e.g. right click in VSCode and select Copy Path) and load it in your browser as a file.

================================================================================================
`);
  }

  return config;
};
