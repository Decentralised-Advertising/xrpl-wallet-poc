import { existsSync } from 'fs';
import { pathToExtension } from './utils';

if (!existsSync(pathToExtension)) {
  throw new Error(`
ERROR: No unpacked extension found at: ${pathToExtension}

You must build the browser extension before running these smoke tests.

Run:

npx ts-node --project=tools/tsconfig.tools.json tools/utils/build-browser-extension.ts
`);
}

import 'setimmediate';
