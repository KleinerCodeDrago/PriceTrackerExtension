function storeSelector(url, selector, content) {
    console.log("Storing selector and content:", selector, content);
    browser.storage.local.get(url).then(result => {
        let existingData = result[url] || {};
        if (content !== '') {
            existingData.content = content;
        }
        existingData.selector = selector;
        browser.storage.local.set({[url]: existingData});
    });
}


browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "storeSelector") {
        console.log("Received storeSelector message:", message);
        storeSelector(message.url, message.selector, message.content);
    }
});

function retrieveSelector(url) {
    console.log("Retrieving selector for URL:", url);
    return browser.storage.local.get(url).then(result => {
        console.log("Retrieved selector:", result[url]);
        return result[url];
    });
}

function getSelectorForCurrentTab(callback) {
    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const url = new URL(tabs[0].url);
        browser.storage.local.get(url.href, function(result) {
            const data = result[url.href];
            if (data) {
                callback({selector: data.selector, content: data.content});
            } else {
                callback({selector: '', content: ''});
            }
        });
    });
}


browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getSelectorForCurrentTab") {
        getSelectorForCurrentTab(function(data) {
            sendResponse(data);
        });
        return true;
    }
});


function getSelectorForCurrentTab(callback) {
    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const url = new URL(tabs[0].url);
        browser.storage.local.get(url.href, function(result) {
            const data = result[url.href];
            console.log("Sending data to popup:", data);
            if (data) {
                callback(data);
            } else {
                callback({selector: '', content: ''});
            }
        });
    });
}