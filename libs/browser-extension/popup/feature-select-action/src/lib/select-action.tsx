import React from 'react';
import { navigateBetweenApps } from '@xrpl-wallet-poc/browser-extension/utils';
import {
  SelectedAccountActions,
  SelectedAccountActivity,
  SelectedAccountBalance,
  SelectedAccountCurrencies,
  Tabs,
} from '@xrpl-wallet-poc/browser-extension/components';
import { Link, Route, Switch, useHistory } from 'react-router-dom';

export function SelectAction() {
  const history = useHistory();

  function navigateToRoot() {
    history.push('/');
  }

  return (
    <div>
      <div>
        <SelectedAccountBalance />
        <SelectedAccountActions />
        <Tabs
          tabs={[
            {
              name: 'Assets',
              component: <SelectedAccountCurrencies />,
            },
            {
              name: 'Activity',
              component: <SelectedAccountActivity />,
            },
          ]}
        />
      </div>
    </div>
  );
}
