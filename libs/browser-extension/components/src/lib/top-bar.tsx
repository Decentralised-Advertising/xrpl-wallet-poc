import { useAuth } from '@xrpl-wallet-poc/browser-extension/hooks';
import { Button } from '@xrpl-wallet-poc/shared/components/button';
import React from 'react';
import { SelectNetwork } from './select-network';
import { SelectIdentity } from './select-identity';
import { LockClosedIcon } from '@heroicons/react/solid';
import { useXRPLContext } from '@xrpl-components/react/hooks/xrpl';

export function TopBar() {
  const { lock } = useAuth();
  const { error, reconnect } = useXRPLContext();
  return (
    <div>
      {error && (
        <div className="w-full p-3 bg-gradient-to-br from-red-500 to-orange-400 text-white to text-xs">
          XRPL Client Error: {error.message}
          <button
            onClick={() => reconnect()}
            className="font-bold float-right text-white underline"
          >
            Reconnect
          </button>
        </div>
      )}
      <div className="p-4 fixed w-full bg-white border-b z-10">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex-grow">
            <Button variant="light" size="small" onPress={lock}>
              <>
                <LockClosedIcon className="w-4 h-4 mr-1" />
                Lock
              </>
            </Button>
          </div>
          <div>
            <SelectNetwork />
          </div>
          <div>
            <SelectIdentity />
          </div>
        </div>
      </div>
      <div className="h-20 w-full"></div>
    </div>
  );
}
