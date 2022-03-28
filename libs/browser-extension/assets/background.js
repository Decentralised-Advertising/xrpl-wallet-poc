chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  alert('message received');
  chrome.browserAction.getPopup({}, (popup) => {
    chrome.windows.create(
      {
        type: 'popup',
        url: popup,
        height: 600,
        width: 400,
      },
      function (newWindow) {}
    );
  });
});
