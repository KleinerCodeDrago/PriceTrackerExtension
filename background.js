function storeSelector(url, selector) {
    browser.storage.local.set({[url]: selector});
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "storeSelector") {
        storeSelector(message.url, message.selector);
    }
});

function retrieveSelector(url) {
    return browser.storage.local.get(url).then(result => {
        return result[url];
    });
}

function getSelectorForCurrentTab(callback) {
    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const url = new URL(tabs[0].url);
        browser.storage.local.get(url.href, function(result) {
            callback(result[url.href]);
        });
    });
}

// Listening for a message to retrieve the selector
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getSelectorForCurrentTab") {
        getSelectorForCurrentTab(function(selector) {
            sendResponse({selector: selector});
        });
        return true;
    }
});