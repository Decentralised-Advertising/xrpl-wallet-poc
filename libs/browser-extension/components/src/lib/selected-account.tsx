import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '@xrpl-wallet-poc/browser-extension/hooks';
import { CopyValue } from '@xrpl-wallet-poc/shared/components/copy-value';
import {
  DuplicateIcon,
  DotsVerticalIcon,
  ExternalLinkIcon,
} from '@heroicons/react/outline';

export function AccountDetails() {
  const { selectedAccount } = useAuth();
  return (
    <Menu as="div" className="relative w-auto">
      <div>
        <Menu.Button className="inline-flex justify-center w-full text-sm font-medium text-gray-900 focus:outline-none">
          <DotsVerticalIcon className="w-4 h-5" />
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
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              <div className="block px-4 py-2 text-sm text-gray-900 cursor-pointer">
                <a
                  target="_blank"
                  href={`https://xrpscan.com/account/${selectedAccount?.address}`}
                >
                  <ExternalLinkIcon className="h-4 w-4 inline mr-2" />
                  View account on xrpscan.org
                </a>
              </div>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export function SelectedAccount() {
  const { selectedAccount } = useAuth();
  return (
    <div className="p-5 flex space-x-2 items-center justify-between">
      <div></div>
      <div className="flex-grow text-center">
        <div className="rounded-lg cursor-pointer bg-gray-50 hover:bg-white transition duration-500 py-2">
          <CopyValue
            valueToCopy={selectedAccount?.address || ''}
            render={(copyState, onCopyClicked) => {
              if (copyState === 'copied') {
                return (
                  <div>
                    <div className="font-semibold">
                      {selectedAccount?.displayName}
                    </div>
                    <div className="text-xs text-gray-400">
                      {selectedAccount?.address}
                      <DuplicateIcon className="inline w-4 h-4 ml-1" />
                    </div>
                    <div className="text-xs font-semibold text-blue-400">
                      Copied address to clipboard!
                    </div>
                  </div>
                );
              }
              return (
                <div
                  onClick={onCopyClicked}
                  //   className='text-teal-600 hover:text-teal-900 mr-4 cursor-pointer'
                >
                  <div className="font-semibold">
                    {selectedAccount?.displayName}
                  </div>
                  <div className="text-xs text-gray-400">
                    {selectedAccount?.address}
                    <DuplicateIcon className="inline w-4 h-4 ml-1" />
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>
      <div>
        <AccountDetails />
      </div>
    </div>
  );
}
