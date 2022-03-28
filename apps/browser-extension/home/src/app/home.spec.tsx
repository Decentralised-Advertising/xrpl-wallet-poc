import { AuthProvider } from '@xrpl-wallet-poc/browser-extension/hooks';
import { render } from '@testing-library/react';
import React from 'react';
import { HomeApp } from './home';

describe('HomeApp', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <AuthProvider>
        <HomeApp />
      </AuthProvider>
    );

    expect(baseElement).toBeTruthy();
  });
});
