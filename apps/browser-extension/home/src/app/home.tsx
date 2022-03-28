import {
  Login,
  ContextProvider,
} from '@xrpl-wallet-poc/browser-extension/components';
import { AccountCreation } from '@xrpl-wallet-poc/browser-extension/home/feature-account-creation';
import { ManageAccount } from '@xrpl-wallet-poc/browser-extension/home/feature-manage-account';
import { useAuth } from '@xrpl-wallet-poc/browser-extension/hooks';
import { Spinner } from '@xrpl-wallet-poc/shared/components/spinner';
import React, { useEffect } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

function LockExtension() {
  const auth = useAuth();
  useEffect(() => {
    auth.lock();
  }, []);
  return null;
}

const PrivateMessageBar = () => (
  <div className="relative bg-gradient-to-r from-teal-400 to-blue-500">
    <div className="max-w-screen-xl mx-auto py-3 px-8">
      <div className="text-center px-16">
        <p className="font-medium text-white text-xs flex flex-row items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            style={{ paddingBottom: '1px' }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="inline ml-3">
            Everything below is running privately within your browser, no data
            is fetched from or stored on remote servers.
          </span>
        </p>
      </div>
    </div>
  </div>
);

export function HomeApp() {
  const auth = useAuth();

  return (
    <ContextProvider>
      <HashRouter>
        {auth.accountState === 'UNKNOWN' && (
          <div className="flex flex-col justify-center items-center h-screen">
            <Spinner size="large" variant="dark" />
          </div>
        )}

        {auth.accountState === 'NO_ACCOUNT' && <AccountCreation />}

        {auth.accountState === 'HAS_ACCOUNT' && !auth.accountsData && (
          <>
            <PrivateMessageBar />
            <Login hasPrivateMessageBar={true} />
          </>
        )}

        {auth.accountState === 'HAS_ACCOUNT' && auth.accountsData && (
          <>
            <PrivateMessageBar />
            <ManageAccount />
          </>
        )}

        <Switch>
          <Route exact path="/lock">
            <LockExtension />
          </Route>
        </Switch>
      </HashRouter>
    </ContextProvider>
  );
}
