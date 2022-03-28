import { delay } from '@xrpl-wallet-poc/shared/utils';
import { BrowserContext, chromium, Page } from 'playwright';
import { initScriptContents } from '../test-data';
import {
  extensionId,
  generateLaunchPersistentContextUserDataDir,
  launchPersistentContextOptions,
} from '../utils';

jest.setTimeout(15000);

describe('Browser Extension', () => {
  describe('Home', () => {
    let browser: BrowserContext;
    let page: Page;

    beforeAll(async () => {
      jest.setTimeout(15000);

      browser = await chromium.launchPersistentContext(
        generateLaunchPersistentContextUserDataDir(),
        launchPersistentContextOptions
      );

      page = await browser.newPage();
    });

    afterAll(async () => {
      await browser.close();
    });

    describe('Load unpacked extension - NO ACCOUNT DATA', () => {
      beforeAll(async () => {
        await page.goto(`chrome-extension://${extensionId}/home.html`, {
          waitUntil: 'domcontentloaded',
        });
      });

      it('should display a welcome message', async () => {
        const element = await page.waitForSelector(
          '[data-cy="welcome-title"]',
          {
            state: 'visible',
          }
        );
        expect(await element!.evaluate((node) => node.innerHTML)).toContain(
          'Welcome to the DA Browser Extension'
        );
      });
    });

    describe('Load unpacked extension - WITH ACCOUNT DATA', () => {
      beforeAll(async () => {
        await page.addInitScript(initScriptContents);

        // We first load a real page so that the content.js of the extension will be loaded
        await page.goto(`http://example.com`, {
          waitUntil: 'domcontentloaded',
        });

        await delay(5000);

        await page.goto(`chrome-extension://${extensionId}/home.html`, {
          waitUntil: 'domcontentloaded',
        });
      });

      it('should display the login screen', async () => {
        const element = await page.waitForSelector(
          '[data-cy="login-container"]',
          {
            state: 'visible',
          }
        );
        expect(await element!.evaluate((node) => node.innerHTML)).toContain(
          'Password'
        );
      });
    });
  });

  //   describe('Popup', () => {
  //     let browser: BrowserContext;
  //     let page: Page;

  //     beforeAll(async () => {
  //       jest.setTimeout(15000);

  //       browser = await chromium.launchPersistentContext(
  //         generateLaunchPersistentContextUserDataDir(),
  //         launchPersistentContextOptions
  //       );

  //       page = await browser.newPage();
  //     });

  //     afterAll(async () => {
  //       await browser.close();
  //     });

  //     describe('Load unpacked extension - NO ACCOUNT DATA', () => {
  //       beforeAll(async () => {
  //         await page.goto(`chrome-extension://${extensionId}/popup.html`, {
  //           waitUntil: 'domcontentloaded',
  //         });
  //       });

  //       it('should display a welcome message', async () => {
  //         const element = await page.waitForSelector(
  //           '[data-cy="welcome-title"]',
  //           {
  //             state: 'visible',
  //           }
  //         );
  //         expect(await element!.evaluate((node) => node.innerHTML)).toContain(
  //           'Welcome to the DA Browser Extension'
  //         );
  //       });
  //     });

  //     describe('Load unpacked extension - WITH ACCOUNT DATA', () => {
  //       beforeAll(async () => {
  //         await page.addInitScript(initScriptContents);

  //         // We first load a real page so that the content.js of the extension will be loaded
  //         await page.goto(`http://example.com`, {
  //           waitUntil: 'domcontentloaded',
  //         });

  //         await delay(5000);

  //         await page.goto(`chrome-extension://${extensionId}/popup.html`, {
  //           waitUntil: 'domcontentloaded',
  //         });
  //       });

  //       it('should display the login screen', async () => {
  //         const element = await page.waitForSelector(
  //           '[data-cy="login-container"]',
  //           {
  //             state: 'visible',
  //           }
  //         );
  //         expect(await element!.evaluate((node) => node.innerHTML)).toContain(
  //           'Password'
  //         );
  //       });
  //     });
  //   });
});
