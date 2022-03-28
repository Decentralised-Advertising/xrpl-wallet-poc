import { useAuth } from '@xrpl-wallet-poc/browser-extension/hooks';
import React, { useEffect } from 'react';
import { Link, Route, Switch, useHistory } from 'react-router-dom';
import { CreateAccountForm } from './create-account-form';
import { ImportAccountForm } from './import-account-form';

export function AccountCreation() {
  const auth = useAuth();
  const history = useHistory();

  useEffect(() => {
    // Ensure the hash-based URL is appropriate at this point
    history.push('/create');
  }, [history]);

  function onNewAccountData(mnemonic: string, password: string) {
    auth.createEmptyAccount(mnemonic, password);
  }

  return (
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
      <main className="py-12 px-8">
        <Switch>
          <Route path="/create/new">
            <CreateAccountForm onNewAccountData={onNewAccountData} />
          </Route>

          <Route path="/create/import-existing">
            <ImportAccountForm />
          </Route>

          {/* Root matcher must come last */}
          <Route path="/">
            <div className="max-w-5xl m-auto">
              <h1
                className="text-5xl font-extrabold leading-tight text-gray-900 text-center"
                data-cy="welcome-title"
              >
                Welcome to the DA Browser Extension
              </h1>
              <p className="mt-4 text-gray-600 text-lg text-center">
                Everything you do here is running privately on your computer,
                nothing is ever sent to our servers. It's important to
                understand that this also means{' '}
                <span className="font-bold">
                  we cannot help you recover any of the secure data
                </span>{' '}
                you create and use within this context.{' '}
                <span className="highlight">
                  Please read all the instructions carefully!
                </span>
              </p>
              <div className="max-w-4xl mx-auto mt-8 sm:mt-12 lg:mt-16">
                <div className="relative">
                  <div className="max-w-md mx-auto space-y-4 lg:max-w-5xl lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0">
                    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                      <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                        <div className="mt-4 flex items-baseline text-4xl leading-none font-extrabold justify-center">
                          Create Account
                        </div>
                        <p className="mt-5 text-lg leading-7 text-gray-500">
                          This will create a new secure account and seed phrase
                          on this device.
                        </p>
                      </div>
                      <div className="flex-1 flex flex-col justify-between p-6 bg-gray-50 space-y-6 sm:p-10">
                        <div className="rounded-md shadow">
                          <Link
                            to="/create/new"
                            className="flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                          >
                            Create Account
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                      <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                        <div className="mt-4 flex items-baseline text-4xl leading-none font-extrabold justify-center">
                          Import Existing
                        </div>
                        <p className="mt-5 text-lg leading-7 text-gray-500">
                          Use existing encrypted data and its linked seed phrase
                          on this device.
                        </p>
                      </div>
                      <div className="flex-1 flex flex-col justify-between p-6 bg-gray-50 space-y-6 sm:p-10">
                        <div className="rounded-md shadow">
                          <Link
                            to="/create/import-existing"
                            className="flex items-center justify-center px-5 py-3 border border-gray-300 text-base leading-6 font-medium rounded-md text-gray-700  hover:text-gray-500 active:text-gray-800 active:bg-gray-50 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                            aria-describedby="tier-standard"
                          >
                            Import Data
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Route>
        </Switch>
      </main>
    </div>
  );
}
