import { Wallet } from 'xrpl';
import { INetwork } from '@xrpl-components/react/hooks/xrpl/default-networks';
import {
  getFromStorage,
  sendMessageToCurrentTab,
  setInStorage,
} from '@xrpl-wallet-poc/browser-extension/utils';
import { decrypt, encrypt } from '@xrpl-wallet-poc/shared/utils';
import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';

export const defaultNetworks: INetwork[] = [
  {
    name: 'mainnet',
    server: 'wss://s1.ripple.com',
  },
  {
    name: 'testnet',
    server: 'wss://s.altnet.rippletest.net',
  },
  {
    name: 'devnet',
    server: 'wss://s.devnet.rippletest.net',
  },
];

export interface Account {
  name?: string;
  address: string;
  publicKey: string;
  privateKey: string;
  seed?: string;
}

export interface PublicAccount {
  displayName: string;
  address: string;
}

export interface Organization {
  id: string;
  name: string;
  address: string;
}

export interface AccountsData {
  accounts: Account[];
  derivationIndex: number;
}

type AccountState = 'UNKNOWN' | 'HAS_ACCOUNT' | 'NO_ACCOUNT';

const authContext = createContext<ReturnType<typeof useProvideAuth> | null>(
  null
);

export const AuthProvider: FunctionComponent = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  // Remove null from the type
  return useContext(authContext)!;
};

function useProvideAuth() {
  /**
   * Rather than a simple "hasAccount" boolean, we have an additional "UNKNOWN" state
   * so that we don't flash the account creation workflow while waiting to know if
   * the user has an account or not.
   */
  const [accountState, setHasAccountState] = useState<AccountState>('UNKNOWN');
  const [accountsData, setAccountsData] = useState<AccountsData | null>(null);
  const [selectedAccount, setselectedAccount] = useState<PublicAccount | null>(
    null
  );
  const [unencryptedMnemonic, setUnencryptedMnemonic] = useState<string | null>(
    null
  );
  const [selectedNetwork, setStoredSelectedNetwork] = useState<INetwork | null>(
    null
  );
  const [availableNetworks, setStoredAvailableNetworks] = useState<
    INetwork[] | null
  >(null);

  const DATA_KEY = 'DA_EXTENSION_ENCRYPTED_DATA';
  const MNEMONIC_KEY = 'DA_EXTENSION_ENCRYPTED_MNEMONIC';
  const SELECTED_PUBLIC_IDENTITY_KEY = 'DA_EXTENSION_SELECTED_PUBLIC_IDENTITY';
  const DECRYPTED_DATA_KEY = 'DA_EXTENSION_DECRYPTED_DATA';
  const EXTENSION_SELECTED_NETWORK_KEY = 'SELECTED_NETWORK';
  const EXTENSION_AVAILABLE_NETWORKS_KEY = 'AVAILABLE_NETWORKS';

  async function checkHasAccount() {
    try {
      await getFromStorage(MNEMONIC_KEY);
      setHasAccountState('HAS_ACCOUNT');
    } catch {
      setHasAccountState('NO_ACCOUNT');
    }
  }

  async function checkHasDecryptedData() {
    try {
      const { unlockedTime, data } = JSON.parse(
        await getFromStorage(DECRYPTED_DATA_KEY)
      );
      setAccountsData(data);
      selectFirstAccountByDefault(data.accounts || []);
      // eslint-disable-next-line no-empty
    } catch {}
  }

  async function selectFirstAccountByDefault(
    decryptedAccounts: AccountsData['accounts']
  ) {
    try {
      const selected = await getCurrentAccount();
      // Already has a selected public identity in storage, set the state accordingly
      if (selected?.displayName) {
        setselectedAccount(selected);
        return;
      }
      // If there is at least one identity, set the first one to be selected by default
      if (decryptedAccounts.length > 0) {
        const { name: displayName, address } = decryptedAccounts[0];
        await setCurrentAccount(displayName || address, address);
        return;
      }
    } catch {
      return;
    }
  }

  async function readEncryptedAccountData() {
    const encryptedAccountData = await getFromStorage(DATA_KEY);
    return encryptedAccountData;
  }

  async function isValidMnemonicAndDataCombination(
    encryptedAccountData: string,
    decryptedMnemonic: string
  ) {
    try {
      await decrypt(encryptedAccountData, decryptedMnemonic);
      return true;
    } catch {
      return false;
    }
  }

  function ensureAccountData(
    maybeAccountData: AccountsData | null
  ): AccountsData {
    return (
      maybeAccountData || {
        derivationIndex: 0,
        accounts: [],
      }
    );
  }

  async function importEncryptedAccountData(encryptedAccountData: string) {
    if (!unencryptedMnemonic) {
      throw new Error('Unable to decrypt the data');
    }

    const existingAccountData = ensureAccountData(accountsData);

    const decryptedNewAccountData = JSON.parse(
      await decrypt(encryptedAccountData, unencryptedMnemonic)
    ) as AccountsData;

    const updatedAccountData: AccountsData = {
      derivationIndex: Math.max(
        existingAccountData.derivationIndex,
        decryptedNewAccountData.derivationIndex
      ),
      accounts: [
        ...existingAccountData.accounts,
        ...decryptedNewAccountData.accounts,
      ],
    };

    await updateEncryptedAccountData(unencryptedMnemonic, updatedAccountData);
    setAccountsData(updatedAccountData);
  }

  async function updateEncryptedAccountData(
    unencryptedMnemonic: string,
    accountData: AccountsData
  ) {
    const encryptedAccountData = await encrypt(
      JSON.stringify(accountData),
      unencryptedMnemonic
    );
    /**
     * Store the encrypted account data in the local storage
     */
    await setInStorage(DATA_KEY, encryptedAccountData);
  }

  async function createAccountInStorage(
    mnemonic: string,
    password: string,
    accountData: AccountsData
  ) {
    try {
      /**
       * Encrypt the mnemonic using the password
       */
      const encryptedMnemonic = await encrypt(mnemonic, password);
      /**
       * Store the encrypted mnemonic in the local storage
       */
      await setInStorage(MNEMONIC_KEY, encryptedMnemonic);
      /**
       * Encrypt the account data using the mnemonic (NOT the password)
       */
      await updateEncryptedAccountData(mnemonic, accountData);

      setUnencryptedMnemonic(mnemonic);
      setAccountsData(accountData);
      setHasAccountState('HAS_ACCOUNT');
    } catch {
      // TODO: More complete error handling here...
      setUnencryptedMnemonic(null);
      setAccountsData({ accounts: [], derivationIndex: 0 });
      setHasAccountState('NO_ACCOUNT');
    }
  }

  async function importExistingAccount(
    mnemonic: string,
    password: string,
    existingEncryptedData?: string
  ) {
    if (!existingEncryptedData) {
      return createEmptyAccount(mnemonic, password);
    }
    const accountData = await decrypt(existingEncryptedData, mnemonic);
    return createAccountInStorage(mnemonic, password, JSON.parse(accountData));
  }

  async function createEmptyAccount(mnemonic: string, password: string) {
    const newAccountData: AccountsData = {
      derivationIndex: 0,
      accounts: [],
    };
    return createAccountInStorage(mnemonic, password, newAccountData);
  }

  async function unlock(password: string) {
    try {
      /**
       * Decrypt the mnemonic using the password
       */
      const decryptedMnemonic = await decryptMnemonicUsingPassword(password);
      /**
       * Decrypt the account data using the mnemonic (NOT the password)
       */
      const encryptedAccountData = await getFromStorage(DATA_KEY);
      const decryptedAccountData = await decrypt(
        encryptedAccountData,
        decryptedMnemonic
      );
      const accountData: AccountsData = JSON.parse(decryptedAccountData);

      setUnencryptedMnemonic(decryptedMnemonic);
      setAccountsData(accountData);
      setInStorage(
        DECRYPTED_DATA_KEY,
        JSON.stringify({ unlockTime: new Date(), data: accountData })
      );
      selectFirstAccountByDefault(accountData.accounts || []);
    } catch (err) {
      setUnencryptedMnemonic(null);
      setAccountsData(null);
      throw new Error('Invalid password');
    }
  }

  function lock() {
    setUnencryptedMnemonic(null);
    setAccountsData(null);
    setInStorage(DECRYPTED_DATA_KEY, '');
  }

  type CreateAccountData = {
    name: Account['name'];
    seed?: Account['seed'] | undefined;
  };

  /**
   * If no existing privateKey hex string is provided we will generate a new
   * privateKey, otherwise we will effectively import the existing one and use
   * it to generate a new publicKey.
   */
  async function createAccount(accountData: CreateAccountData) {
    if (!unencryptedMnemonic) {
      throw new Error('Unable to decrypt the data');
    }

    try {
      const existingAccountData = ensureAccountData(accountsData);
      const wallet = accountData.seed
        ? Wallet.fromSeed(accountData.seed)
        : Wallet.fromMnemonic(unencryptedMnemonic, {
            derivationPath: `m/44'/60'/0'/0'/${existingAccountData.derivationIndex++}`,
          });
      const { classicAddress, privateKey, publicKey, seed } = wallet;
      const newAccount: Account = {
        address: classicAddress,
        privateKey: privateKey,
        publicKey: publicKey,
        seed: seed,
        ...accountData,
      };

      const newAccountData = { ...existingAccountData };
      newAccountData.accounts.push(newAccount);

      await updateEncryptedAccountData(unencryptedMnemonic, newAccountData);
      setAccountsData(newAccountData);
    } catch (err) {
      console.error(err);
      throw new Error('Could not add new Identity');
    }
  }

  async function updateAccount(
    account: Account,
    updatedAccountData: Omit<
      Account,
      'privateKey' | 'publicKey' | 'address' | 'seed'
    >
  ) {
    if (!unencryptedMnemonic) {
      throw new Error('Unable to decrypt the data');
    }

    try {
      const existingAccountData = ensureAccountData(accountsData);
      const newAccountData = { ...existingAccountData };

      newAccountData.accounts = [
        ...newAccountData.accounts.map((accountToMaybeUpdate) => {
          if (accountToMaybeUpdate.privateKey === account.privateKey) {
            accountToMaybeUpdate.name = updatedAccountData.name;
          }
          return accountToMaybeUpdate;
        }),
      ];

      await updateEncryptedAccountData(unencryptedMnemonic, newAccountData);
      setAccountsData(newAccountData);
    } catch {
      throw new Error('Could not update the name of the Identity');
    }
  }

  async function removeAccount(account: Account) {
    if (!unencryptedMnemonic) {
      throw new Error('Unable to decrypt the data');
    }

    try {
      const existingAccountData = ensureAccountData(accountsData);
      const newAccountData = { ...existingAccountData };

      newAccountData.accounts = [
        ...newAccountData.accounts.filter((accountToMaybeRemove) => {
          if (accountToMaybeRemove.address === account.address) {
            return false;
          }
          return true;
        }),
      ];

      await updateEncryptedAccountData(unencryptedMnemonic, newAccountData);
      setAccountsData(newAccountData);
    } catch {
      throw new Error('Could not remove the account');
    }
  }
  /**
   * Perform a fresh decryption of the mnemonic using the given password
   */
  async function decryptMnemonicUsingPassword(password: string) {
    const encryptedMnemonic = await getFromStorage(MNEMONIC_KEY);
    const decryptedMnemonic = await decrypt(encryptedMnemonic, password);
    return decryptedMnemonic;
  }

  async function setCurrentAccount(displayName: string, address: string) {
    const account: PublicAccount = { displayName, address };
    // We set it in state so that other parts of the extension app can read it
    setselectedAccount(account);
    // We also set it in storage so that content.js can access it
    await setInStorage(SELECTED_PUBLIC_IDENTITY_KEY, JSON.stringify(account));
    // Notify content.js
    await sendMessageToCurrentTab({
      type: 'selectedIdentityChange',
      data: {
        address,
        displayName,
      },
    });
  }

  async function getCurrentAccount(): Promise<PublicAccount | null> {
    try {
      const data = await getFromStorage(SELECTED_PUBLIC_IDENTITY_KEY);
      const { displayName, address } = JSON.parse(data);
      if (typeof displayName !== 'string' || typeof address !== 'string') {
        throw new Error(
          `${SELECTED_PUBLIC_IDENTITY_KEY} contains invalid identity`
        );
      }
      return {
        displayName,
        address,
      };
    } catch (e) {
      return null;
    }
  }

  async function loadNetworks() {
    let availableNetworks: INetwork[] = defaultNetworks;
    try {
      const storedAvailableNetworks = await getFromStorage(
        EXTENSION_AVAILABLE_NETWORKS_KEY
      );
      if (storedAvailableNetworks) {
        availableNetworks = JSON.parse(storedAvailableNetworks);
      }
      // eslint-disable-next-line no-empty
    } catch {}
    setAvailableNetworks(availableNetworks);
    try {
      const storedSelectedNetworks = await getFromStorage(
        EXTENSION_SELECTED_NETWORK_KEY
      );
      if (storedSelectedNetworks) {
        setStoredSelectedNetwork(JSON.parse(storedSelectedNetworks));
      }
    } catch (e) {
      setSelectedNetwork(availableNetworks[0]);
    }
  }

  async function setSelectedNetwork(network: INetwork) {
    setStoredSelectedNetwork(network);
    await setInStorage(EXTENSION_SELECTED_NETWORK_KEY, JSON.stringify(network));
  }

  async function setAvailableNetworks(networks: INetwork[]) {
    setStoredAvailableNetworks(networks);
    await setInStorage(
      EXTENSION_AVAILABLE_NETWORKS_KEY,
      JSON.stringify(networks)
    );
  }

  useEffect(() => {
    /**
     * Artificially slow this down a little bit so that the spinner
     * doesn't flash in such a jarring way
     */
    setTimeout(() => {
      checkHasAccount();
    }, 1000);
    checkHasDecryptedData();
    loadNetworks();
  }, []);

  return {
    accountsData,
    selectedAccount,
    readEncryptedAccountData,
    isValidMnemonicAndDataCombination,
    importEncryptedAccountData,
    accountState,
    importExistingAccount,
    createEmptyAccount,
    unlock,
    lock,
    createAccount,
    updateAccount,
    removeAccount,
    decryptMnemonicUsingPassword,
    setCurrentAccount,
    getCurrentAccount,
    selectedNetwork,
    setSelectedNetwork,
    availableNetworks,
  };
}
