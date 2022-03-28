import React, { useEffect } from 'react';
import { useAuth } from '@xrpl-wallet-poc/browser-extension/hooks';
import { AccountBalance } from '@xrpl-components/react/components/account-balance';

export function SelectedAccountBalance() {
  const { selectedAccount } = useAuth();
  return (
    <div>
      <AccountBalance account={selectedAccount?.address || ''}>
        {({ isLoading, value, currency }) => {
          return (
            <div
              className="text-4xl p-4 h-20 flex items-center justify-center"
              style={{
                fontFamily: `"currency_symbols", "Space Mono", monospace`,
                fontWeight: 400,
              }}
            >
              {isLoading ? (
                <img className="w-9 h-9" src="assets/xrp-loader.c0ef7e34.png" />
              ) : (
                // Apply a negative margin at the top to compensate for the monospace font
                <div className="flex items-center justify-center space-x-2 -mt-2">
                  <div>
                    <AccountBalance.Value>{value}</AccountBalance.Value>
                  </div>
                  <div>
                    <AccountBalance.Currency unicodeSymbol={true}>
                      {currency}
                    </AccountBalance.Currency>
                  </div>
                </div>
              )}
            </div>
          );
        }}
      </AccountBalance>
    </div>
  );
}
