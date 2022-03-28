import { Button } from '@xrpl-wallet-poc/shared/components/button';
import React from 'react';
import { ArrowRightIcon, SwitchVerticalIcon } from '@heroicons/react/solid';

export function SelectedAccountActions() {
  return (
    <div className="flex items-center">
      <div className="mx-auto flex gap-4">
        <Button size="medium" variant="primary" className="rounded-full">
          <>
            <div>
              <ArrowRightIcon className="w-5 h-5 mr-1" />
            </div>
            <div>Send Payment</div>
          </>
        </Button>
        <Button size="medium" variant="primary" className="rounded-full">
          <>
            <div>
              <SwitchVerticalIcon className="w-5 h-5 mr-1" />
            </div>
            <div>Swap</div>
          </>
        </Button>
      </div>
    </div>
  );
}
