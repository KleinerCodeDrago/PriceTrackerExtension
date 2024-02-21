function storeSelector(url, selector, content) {
    console.log("Storing selector and content:", selector, content);
    browser.storage.local.get(url).then(result => {
        let existingData = result[url] || {};
        if (content !== '') {
            existingData.content = normalizeContent(content);
        }
        existingData.selector = selector;
        browser.storage.local.set({[url]: existingData});
    });
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "storeSelector") {
        console.log("Received storeSelector message:", message);
        storeSelector(message.url, message.selector, message.content);
    } else if (message.action === "getSelectorForCurrentTab") {
        getSelectorForCurrentTab(function(data) {
            sendResponse(data);
        });
        return true;
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
        if (tabs.length === 0 || !tabs[0].url) {
            callback({selector: '', content: ''});
            return;
        }

        const url = tabs[0].url;
        browser.storage.local.get(url, function(result) {
            const data = result[url];
            console.log("Sending data to popup:", data);
            if (data) {
                callback(data);
            } else {
                callback({selector: '', content: ''});
            }
        });
    });
}


browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "initiateImport") {
        browser.tabs.create({url: "import.html"});
    }
});

function getSelectorForCurrentTab(callback) {
    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs.length === 0 || !tabs[0].url) {
            callback({selector: '', content: ''});
            return;
        }

        const url = tabs[0].url;
        browser.storage.local.get(url, function(result) {
            const data = result[url];
            console.log("Sending data to popup:", data);
            if (data) {
                callback(data);
            } else {
                callback({selector: '', content: ''});
            }
        });
    });
}

function importData(data) {
    console.log("Importing data:", data);
    browser.storage.local.clear(() => {
        for (let url in data) {
            if (data.hasOwnProperty(url)) {
                let item = data[url];

                if (item.hasOwnProperty('selector') && item.hasOwnProperty('content')) {
                    let storageItem = {};
                    storageItem[url] = item;
                    browser.storage.local.set(storageItem).then(() => {
                        console.log("Data imported for URL:", url);
                    }).catch((error) => {
                        console.error("Error setting data for URL:", url, error);
                    });
                } else {
                    console.error("Invalid data format for URL:", url, item);
                }
            }
        }
    });
}


browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "importData") {
        importData(message.data);
    }
});


function normalizeContent(content) {
    let numericContent = content.replace(/[^\d,.-]/g, '');

    let lastCommaIndex = numericContent.lastIndexOf(',');
    let lastDotIndex = numericContent.lastIndexOf('.');

    if (lastCommaIndex > lastDotIndex) {
        numericContent = numericContent.substring(0, lastCommaIndex).replace(/,/g, '') + '.' + numericContent.substring(lastCommaIndex + 1);
    } else {
        numericContent = numericContent.replace(/,/g, '');
    }

    return numericContent;
}


function checkPrices() {
    browser.storage.local.get(null, function(items) {
        for (let url in items) {
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                console.error('Invalid URL:', url);
                continue;
            }

            let storedData = items[url];
            fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const element = doc.querySelector(storedData.selector);
                const currentContent = element ? normalizeContent(element.innerText) : '';
                
            })
            .catch(error => console.error('Error fetching the page:', error));
        }
    });
}


browser.alarms.create("checkPricesAlarm", { delayInMinutes: 1, periodInMinutes: 1 });
browser.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === "checkPricesAlarm") {
        checkPrices();
    }
});

