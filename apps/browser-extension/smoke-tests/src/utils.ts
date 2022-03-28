import { resolve } from 'path';

export const pathToExtension = resolve(
  __dirname,
  '../../../../',
  'dist/apps/browser-extension/unpacked'
);

/**
 * We need to tell Chromium we want to load the web extension and we
 * have to run in "headful mode" in order to test the extension.
 */
export const launchPersistentContextOptions = {
  headless: false,
  slowMo: 250,
  devtools: true,
  args: [
    `--disable-extensions-except=${pathToExtension}`,
    `--load-extension=${pathToExtension}`,
    '--show-component-extension-options',
  ],
};

/**
 * Our persistent user data context when launching Chromium
 */
export function generateLaunchPersistentContextUserDataDir() {
  const randomHex = [...Array(8)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');
  return `/tmp/test-user-data-dir/${randomHex}`;
}

/**
 * This is the Extension ID that matches the "key" property in the manifest.json
 *
 * Both values were generated using tools/utils/generate-chrome-extension-id.sh
 *
 * This allows us to work with a single ID which is consistent across local
 * development and CI servers.
 */
export const extensionId = 'meffidapinofigdlekbgllkbdfgnihgd';
