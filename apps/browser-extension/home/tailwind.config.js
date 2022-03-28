/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
const { resolve } = require('path');
const {
  autoResolveWorkspaceDepsPurgePatterns,
} = require('../../../tools/utils/auto-resolve-workspace-deps-purge-pattens');

module.exports = {
  presets: [require('../../../tailwind.config')],
  purge: {
    content: [
      resolve(__dirname, 'src/**/*.tsx'),
      ...autoResolveWorkspaceDepsPurgePatterns(__filename),
    ],
  },
};
