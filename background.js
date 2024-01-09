function storeSelector(url, selector) {
    browser.storage.local.set({[url]: selector});
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "storeSelector") {
        storeSelector(message.url, message.selector);
    }
});
