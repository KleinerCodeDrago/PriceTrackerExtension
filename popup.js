let selectingElement = false;

document.getElementById('selectElement').addEventListener('click', () => {
    selectingElement = !selectingElement;
    updateButtonAndStatus();

    if (selectingElement) {
        browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {action: "selectElement"});
        });
    }
});

function updateButtonAndStatus() {
    const button = document.getElementById('selectElement');
    const status = document.getElementById('status');

    if (selectingElement) {
        button.textContent = 'Cancel Selection';
        status.textContent = 'Select an element on the page...';
    } else {
        button.textContent = 'Select an Element';
        status.textContent = 'Click the button to start element selection.';
    }
}

document.getElementById('exportData').addEventListener('click', () => {
    browser.storage.local.get(null, function(items) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "price_tracker_data.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });
});

document.getElementById('importData').addEventListener('click', () => {
    browser.runtime.sendMessage({action: "initiateImport"});
});



document.addEventListener('DOMContentLoaded', function() {
    browser.runtime.sendMessage({action: "getSelectorForCurrentTab"})
    .then(data => {
        console.log("Data received in popup:", data);
        if (data && 'selector' in data && data.selector !== '') {
            document.getElementById('currentSelector').textContent = 'Current Selector: ' + data.selector;
            document.getElementById('selectedContent').textContent = 'Selected Content: ' + (data.content || 'No content captured');
        } else {
            document.getElementById('currentSelector').textContent = 'No selector stored for this page.';
            document.getElementById('selectedContent').textContent = 'No content captured';
        }
    }).catch(error => {
        console.error("Error in receiving data:", error);
    });
    updateWatchedPricesList();
});


function updateWatchedPricesList() {
    browser.storage.local.get(null, function(items) {
        const watchedPricesList = document.getElementById('watchedPricesList');
        watchedPricesList.innerHTML = '';

        for (let url in items) {
            let item = items[url];
            let div = document.createElement('div');
            div.innerHTML = `
                <p><strong>URL:</strong> ${url}</p>
                <p><strong>Selector:</strong> ${item.selector}</p>
                <p><strong>Current Price:</strong> ${item.content}</p>
                <button class="deleteButton" data-url="${url}">Delete</button>
            `;
            watchedPricesList.appendChild(div);
        }

        document.querySelectorAll('.deleteButton').forEach(button => {
            button.addEventListener('click', function() {
                let urlToDelete = this.getAttribute('data-url');
                browser.storage.local.remove(urlToDelete, function() {
                    updateWatchedPricesList();
                });
            });
        });
    });
}

