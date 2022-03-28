// @ts-check

/**
 * We use this to seed the browser extension storage during smoke-tests
 */
document.addEventListener('DA_PLAYWRIGHT_SET_STORAGE_DATA', (event) => {
  const customEvent = /** @type {CustomEvent} */ (event);
  chrome.storage.local.set(customEvent.detail, () => {
    // Cannot recover test from this state, so block with an alert
    if (chrome.runtime.lastError) {
      alert(
        `Error: "chrome.runtime.lastError" is set - ${chrome.runtime.lastError.message}`
      );
    }
  });
});

/**
 * We use this to know when to start seeding the browser extension storage
 * during smoke-tests
 */
setTimeout(() => {
  document.dispatchEvent(
    new CustomEvent('DA_EXTENSION_CONTENT_JS_READY', {
      detail: {},
    })
  );
});
