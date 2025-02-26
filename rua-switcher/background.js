async function updateUserAgent() {
  let { userAgent } = await chrome.storage.local.get("userAgent");

  if (!userAgent) return;

  let newRule = {
    id: 1,
    priority: 1,
    action: {
      type: "modifyHeaders",
      requestHeaders: [
        {
          header: "User-Agent",
          operation: "set",
          value: userAgent,
        },
      ],
    },
    condition: {
      urlFilter: "*",
      resourceTypes: ["main_frame"],
    },
  };

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [newRule],
  });
  chrome.tabs.reload();
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateUserAgent") {
    updateUserAgent();
  }
});

chrome.runtime.onInstalled.addListener(() => {
  updateUserAgent();
});
