import React, { useEffect, useState } from 'react';
import { useAuth } from '@xrpl-wallet-poc/browser-extension/hooks';
import { useXRPLContext } from '@xrpl-components/react/hooks/xrpl';
import { AccountTxRequest, Transaction, TransactionMetadata } from 'xrpl';

interface AccountTransaction {
  ledger_index: number;
  meta: string | TransactionMetadata;
  tx?: Transaction;
  tx_blob?: string;
  validated: boolean;
}

export function SelectedAccountActivity() {
  const { selectedAccount } = useAuth();
  const { client } = useXRPLContext();
  const [transactions, setTransactions] = useState<any[]>([]);
  useEffect(() => {
    client
      ?.request({
        command: 'account_tx',
        account: selectedAccount?.address,
      } as AccountTxRequest)
      .then((res) => setTransactions(res.result.transactions))
      .catch(console.error);
  }, [selectedAccount?.address, client]);
  console.log(transactions);
  return (
    <div className="flex-col divide-y bg-white">
      {transactions?.map((tx: AccountTransaction) => (
        <div key={tx.tx?.TxnSignature} className="p-5">
          <div>{tx.tx?.TransactionType}</div>
        </div>
      ))}
    </div>
  );
}
