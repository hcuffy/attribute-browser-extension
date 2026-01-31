chrome.runtime.onInstalled.addListener((details) => {
    console.log('[Attribute Scanner] Extension installed:', details.reason);

    if (details.reason === 'install') {
        console.log('[Attribute Scanner] Welcome! Click the extension icon to start scanning.');
    } else if (details.reason === 'update') {
        console.log('[Attribute Scanner] Extension updated to version:', chrome.runtime.getManifest().version);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Attribute Scanner] Background received message:', message, 'from:', sender.tab?.url);

    sendResponse({ received: true });
    return true;
});

export {};
