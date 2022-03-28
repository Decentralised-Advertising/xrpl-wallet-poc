const DATA_KEY = 'DA_EXTENSION_ENCRYPTED_DATA';
const MNEMONIC_KEY = 'DA_EXTENSION_ENCRYPTED_MNEMONIC';

/**
 * Reference data used to generate the below encrypted data
 *
 * const password = 'gn4823$39($fjIooPEFnf@';
 * const mnemonic = 'message earn normal tray depend use ticket solar list monkey wasp rib';
 */
const encryptedMnemonic =
  'nVYz6oL2jkkP01Y3DL4AouTxDbpEIH8Rt25aQ1rDxI2Eoh6/TmxL9aX8euej/OW35jSTHVIxLKzNB4p3UwFGkNQS4cvPciZnh/3UhvJeFYilspTNKcsS8bGQPjLpCjLhWsjlIUkjrh9mJWmVXqNnGg==';
const encryptedData =
  'ViLaX9SWQN8Tia2RagcWfYl4vfTk1IWTagwfKxE3abUN05/qRJ/YKxoKX+uk6ImXS/x2sv0KWUhihSdGtvX3C6JoA5H2gCtQlalneWE3WXY+iXAgBSZA6a8197pczoKPQZKv+qTzpK38eaTZhc6oDR5Jn9leoIxCvudLKoHT1Msfw0H6q02+mWSaaxV0bm62r3E3XyP5gHaGFB3deXEnJeAzIRlzkG4XwwSaij9l8tW7Fi4sFj23EVXP9GcvtG3nBhOrKtc8abUBT1qKf120duu3ezJitqhxFA/8oti4vAbmPZuqzFJZx4V2Ni0enWrin2oOmb5erOn/o+ZQVC0RP6yLWrhaQJgy/RRlzx1mju1Zc1B5gFNa8yY8X1NJbQ6RPAwKVh2yBCtGmfBUc4DE846sDi4ykY1rpENnVs0T8YvQTS/tkxuLhtcSqlF4chF188Nxt8CdddfkiXYiGd37ffXENyozJ65EJC/eb1g0CM9IbIHtrgjHSSabLp1WbcBcGkMjtYUnwlZtp1PUYo/wc7xGnOxyV/xAmc1GIybJ/qCvmfREiecS1D7BOWTKnxKY9GnVI3X/0G4WeV0cZNwzLsmnrdRUwXofz62mgyhG08WZh05rZRSq5Rx+T9X9HObpEmyWorryg+7WMkYn7xuXPIc/c88cS+wifDt0w9JMxCz6r1jVtzGc7bQjSi3rkJsiQZ5eZMhtt7bV8v9xyFww16D9+wdBYanapGa5DvGEwJ85h5BN38LRRfoTOAyXtyDZ';

/**
 * The initScript is used to seed the browser extension storage with appropriate
 * data to allow us to write tests which make assertions about key workflows which
 * require you to have already set up an account.
 */
export const initScriptContents = `
  document.addEventListener('DA_EXTENSION_CONTENT_JS_READY', () => {
    document.dispatchEvent(
      new CustomEvent('DA_PLAYWRIGHT_SET_STORAGE_DATA', {
        detail: {
          '${MNEMONIC_KEY}': '${encryptedMnemonic}',
          '${DATA_KEY}': '${encryptedData}'
        },
      })
    );
  }, { once: true });
`;
