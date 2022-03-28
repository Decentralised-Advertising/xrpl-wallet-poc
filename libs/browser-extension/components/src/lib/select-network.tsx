/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  ExclamationCircleIcon,
  CheckIcon,
} from '@heroicons/react/solid';
import { useAuth } from '@xrpl-wallet-poc/browser-extension/hooks';
import React, { useEffect } from 'react';
import { useXRPLContext } from '@xrpl-components/react/hooks/xrpl';
import { Button } from '@xrpl-wallet-poc/shared/components/button';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function SelectNetwork() {
  const { setSelectedNetwork, selectedNetwork, availableNetworks } = useAuth();
  console.log(availableNetworks);
  const { connectionState, error } = useXRPLContext();
  return (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button className="inline-flex justify-center w-full rounded-full shadow-sm px-4 py-2 border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
          {selectedNetwork?.name}
          {connectionState === 'connected' && (
            <CheckCircleIcon
              className="-mr-1 ml-2 h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          )}
          {connectionState === 'connecting' && (
            <QuestionMarkCircleIcon
              className="-mr-1 ml-2 h-5 w-5 text-indigo-400"
              aria-hidden="true"
            />
          )}
          {error && (
            <ExclamationCircleIcon
              className="-mr-1 ml-2 h-5 w-5 text-red-400"
              aria-hidden="true"
            />
          )}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
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
              Switch Network
            </div>
            {availableNetworks?.map((network, i) => (
              <Menu.Item key={network.name}>
                {({ active }) => (
                  <div
                    onClick={() => {
                      setSelectedNetwork(network);
                    }}
                    className={classNames(
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    <div className="flex w-64 gap-4 cursor-pointer items-center">
                      <div className="flex-grow">
                        <div className="block font-semibold">
                          {network.name}
                        </div>
                        <div className="block text-gray-400 text-xs">
                          {network.server}
                        </div>
                      </div>
                      <div className="w-5">
                        {network?.name === selectedNetwork?.name && (
                          <CheckIcon className="w-5 h-5 text-black" />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Menu.Item>
            ))}
            <Menu.Item>
              {() => (
                <div className={classNames('block px-4 py-2 text-sm')}>
                  <Button
                    variant="primary"
                    size="small"
                    className="rounded-full w-full"
                  >
                    Add Network
                  </Button>
                </div>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
