import { AuthProvider } from '@xrpl-wallet-poc/browser-extension/hooks';
import { render } from '@testing-library/react';
import React from 'react';
import { PopupApp } from './popup';

describe('PopupApp', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <AuthProvider>
        <PopupApp />
      </AuthProvider>
    );

    expect(baseElement).toBeTruthy();
  });
});
