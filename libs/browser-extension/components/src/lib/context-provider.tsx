import React from 'react';
import { XRPLContextProvider } from '@xrpl-components/react/components/xrpl-context-provider';
import * as xrpl from 'xrpl';
import { useAuth } from '@xrpl-wallet-poc/browser-extension/hooks';

export interface ContextProviderProps {
  children: any;
}

export function ContextProvider({ children }: ContextProviderProps) {
  const { selectedNetwork } = useAuth();
  return (
    <XRPLContextProvider xrpl={xrpl} server={selectedNetwork?.server}>
      {children}
    </XRPLContextProvider>
  );
}
