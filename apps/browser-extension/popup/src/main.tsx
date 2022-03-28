import 'setimmediate';
import { AuthProvider } from '@xrpl-wallet-poc/browser-extension/hooks';
import { OverlayProvider } from '@react-aria/overlays';
import React from 'react';
import ReactDOM from 'react-dom';
import { PopupApp } from './app/popup';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <OverlayProvider>
        <PopupApp />
      </OverlayProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
