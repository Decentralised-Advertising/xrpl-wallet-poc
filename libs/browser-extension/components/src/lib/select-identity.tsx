import { useAuth } from '@xrpl-wallet-poc/browser-extension/hooks';
import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { AccountBalance } from '@xrpl-components/react/components/account-balance';
import stc from 'string-to-color';
import { CheckIcon } from '@heroicons/react/solid';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function SelectIdentity() {
  const auth = useAuth();

  async function setSelectedAccount(address: string) {
    const newAccount = auth.accountsData?.accounts.find(
      (i) => i.address === address
    );
    if (!newAccount) {
      return;
    }
    await auth.setCurrentAccount(
      newAccount.name || newAccount.address,
      newAccount.address
    );
  }

  return (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button className="h-10 w-10 mt-1 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
          <AddressIcon address={auth?.selectedAccount?.address} />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-3">
            <div className="block px-4 pb-3 text-xs border-b font-semibold">
              Switch Account
            </div>
            {auth.accountsData?.accounts.map((account, i) => (
              <Menu.Item key={account.address}>
                {({ active }) => (
                  <div
                    onClick={() => {
                      setSelectedAccount(account.address);
                    }}
                    className={classNames(
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    <div className="flex w-64 gap-4 cursor-pointer items-center">
                      <div>
                        <div className="w-10 h-10 rounded-full shadow">
                          <AddressIcon address={account.address} />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="block font-semibold">
                          {account.name}
                        </div>
                        <div className="block text-gray-400">
                          <AccountBalance account={account.address}>
                            {({ value, currency }) => (
                              // Apply a negative margin at the top to compensate for the monospace font
                              <div className="flex items-center">
                                <div>
                                  <AccountBalance.Value>
                                    {value}
                                  </AccountBalance.Value>
                                </div>
                                <div
                                  style={{
                                    fontFamily: `"currency_symbols", monospace`,
                                    fontWeight: 400,
                                  }}
                                >
                                  <AccountBalance.Currency unicodeSymbol={true}>
                                    {currency}
                                  </AccountBalance.Currency>
                                </div>
                              </div>
                            )}
                          </AccountBalance>
                        </div>
                      </div>
                      <div className="w-5">
                        {auth?.selectedAccount?.address === account.address && (
                          <CheckIcon className="w-5 h-5 text-black" />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export function AddressIcon({ address }: any) {
  return (
    <div style={{ color: stc(address) }}>
      {/* <?xml version="1.0" encoding="utf-8"?> */}
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 128 128"
      >
        <circle fill="currentColor" cx="64.05" cy="63.95" r="63.95" />
        <path
          id="path985"
          fill="white"
          d="M91.88,33.06h11.32L79.6,55.18c-4.23,3.83-9.74,5.95-15.45,5.95c-5.71,0-11.22-2.12-15.45-5.95
	L25.1,33.06h11.32l17.88,16.72c2.67,2.45,6.16,3.81,9.79,3.81c3.62,0,7.12-1.36,9.79-3.81L91.88,33.06z"
        />
        <path
          id="path987"
          fill="white"
          d="M36.32,94.44H25l23.7-22.22c4.21-3.88,9.73-6.03,15.45-6.03s11.24,2.15,15.45,6.03l23.7,22.22
	H91.98L73.99,77.51c-2.67-2.45-6.16-3.81-9.79-3.81s-7.12,1.36-9.79,3.81L36.32,94.44z"
        />
      </svg>
    </div>
  );
}
