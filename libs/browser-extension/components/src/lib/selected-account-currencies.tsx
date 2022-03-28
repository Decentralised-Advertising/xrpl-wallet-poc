import React, { useEffect, useState } from 'react';
import { useAuth } from '@xrpl-wallet-poc/browser-extension/hooks';
import { useXRPLContext } from '@xrpl-components/react/hooks/xrpl';
import { AccountBalance } from '@xrpl-components/react/components/account-balance';

export function SelectedAccountCurrencies() {
  const { selectedAccount } = useAuth();
  const { client } = useXRPLContext();
  const [balances, setBalances] = useState<any[] | null>(null);
  useEffect(() => {
    selectedAccount &&
      client
        ?.getBalances(selectedAccount?.address)
        .then((balances) => setBalances(balances))
        .catch(() => setBalances(null)); // .filter(b => b.currency !== 'XRP')
  }, [selectedAccount, client]);
  return (
    <>
      <div className="flex-col divide-y bg-white">
        {balances?.map(({ currency, value, issuer }) => (
          <div key={currency + issuer} className="p-5">
            <div>
              <div className="font-semibold text-md">
                <span className="mr-1">
                  <AccountBalance.Value>{value}</AccountBalance.Value>
                </span>
                <AccountBalance.Currency>{currency}</AccountBalance.Currency>
              </div>
              {issuer && (
                <div className="text-xs text-gray-500">issuer: {issuer}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
