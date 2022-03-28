import { useAuth } from '@xrpl-wallet-poc/browser-extension/hooks';
import { navigateBetweenApps } from '@xrpl-wallet-poc/browser-extension/utils';
import { Button } from '@xrpl-wallet-poc/shared/components/button';
import React from 'react';
import { HashRouter } from 'react-router-dom';
import {
  Login,
  ContextProvider,
  TopBar,
  SelectedAccount,
} from '@xrpl-wallet-poc/browser-extension/components';
import { SelectAction } from '@xrpl-wallet-poc/browser-extension/popup/feature-select-action';

export function PopupApp() {
  const auth = useAuth();
  return (
    <ContextProvider>
      <HashRouter>
        {/* Showing a loading spinner here seems to cause a lot of jank when opening the popup, so just render nothing */}
        {auth.accountState === 'UNKNOWN' && null}

        {auth.accountState === 'NO_ACCOUNT' && (
          <div>
            <header className="pt-16 flex justify-center items-center">
              {/* DA Logo SVG */}
              <svg
                className="h-10 w-auto fill-current text-gray-800"
                viewBox="0 0 169.33 107.16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g strokeWidth=".265">
                  <path
                    d="M97.209 16.798L106.36.968l60.935 105.542-83.113-.158s42.093-35.357 13.025-89.557zM.858.943v105.414l35.973-.052s51.153-.44 51.153-52.437C87.984.404 34.424.81 34.424.81z"
                    strokeWidth=".1897082"
                  />
                </g>
              </svg>
            </header>
            <div className="px-8 pt-16 text-center pb-8 mt-6">
              <div className="flex flex-col items-center justify-center h-32">
                <h1 className="text-3xl font-extrabold" data-cy="welcome-title">
                  Welcome to the DA Browser Extension
                </h1>
                <p className="mt-6 text-gray-600 text-base mb-12">
                  Everything you do here is running privately on your computer,
                  nothing is ever sent to our servers.
                </p>

                <Button
                  type="button"
                  size="medium"
                  variant="primary"
                  onPress={() => {
                    navigateBetweenApps('home', '/create');
                  }}
                >
                  Create or Import Account
                </Button>
              </div>
            </div>
          </div>
        )}

        {auth.accountState === 'HAS_ACCOUNT' && !auth.accountsData && (
          <Login hasPrivateMessageBar={false} />
        )}

        {auth.accountState === 'HAS_ACCOUNT' && auth.accountsData && (
          <>
            <TopBar />
            <SelectedAccount />
            <SelectAction />
          </>
        )}
      </HashRouter>
    </ContextProvider>
  );
}
