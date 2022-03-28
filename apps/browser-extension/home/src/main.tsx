import 'setimmediate';
import { AuthProvider } from '@xrpl-wallet-poc/browser-extension/hooks';
import { OverlayProvider } from '@react-aria/overlays';
import React from 'react';
import ReactDOM from 'react-dom';
import { HomeApp } from './app/home';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <OverlayProvider>
        <HomeApp />
      </OverlayProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
