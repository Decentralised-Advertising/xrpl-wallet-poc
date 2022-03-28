import execa from 'execa';
import { remove, ensureDir, copy, move } from 'fs-extra';

(async function main() {
  const homeAppProcess = buildBrowserExtensionApp('home');
  if (!homeAppProcess || !homeAppProcess.stdout || !homeAppProcess.stderr) {
    throw new Error('Something went wrong when building the "home" app');
  }
  homeAppProcess.stdout.pipe(process.stdout);
  homeAppProcess.stderr.pipe(process.stderr);

  const popupAppProcess = buildBrowserExtensionApp('popup');
  if (!popupAppProcess || !popupAppProcess.stdout || !popupAppProcess.stderr) {
    throw new Error('Something went wrong when building the "popup" app');
  }
  popupAppProcess.stdout.pipe(process.stdout);
  popupAppProcess.stderr.pipe(process.stderr);

  await Promise.all([homeAppProcess, popupAppProcess]);

  await remove('./dist/apps/browser-extension/unpacked');

  await ensureDir('./dist/apps/browser-extension/unpacked');

  await copy(
    './dist/apps/browser-extension/home/',
    './dist/apps/browser-extension/unpacked/'
  );
  await copy(
    './dist/apps/browser-extension/popup/',
    './dist/apps/browser-extension/unpacked/'
  );

  await remove('./dist/apps/browser-extension/unpacked/assets/fonts');

  await move(
    './dist/apps/browser-extension/unpacked/assets/shared/manifest.json',
    './dist/apps/browser-extension/unpacked/manifest.json'
  );

  console.log(
    `Success! Unpacked browser extension is ready for use: dist/apps/browser-extension/unpacked`
  );
})();

function buildBrowserExtensionApp(appName: 'home' | 'popup') {
  return execa(
    'npx',
    [
      'nx',
      'build',
      `browser-extension-${appName}`,
      '--prod',
      '--skip-nx-cache',
    ],
    {
      env: {
        NODE_ENV: 'production',
        INLINE_RUNTIME_CHUNK: 'false',
        GENERATE_SOURCEMAP: 'false',
      },
    }
  );
}
