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

document.addEventListener('DOMContentLoaded', function() {
    browser.runtime.sendMessage({action: "getSelectorForCurrentTab"})
        .then(data => {
            console.log("Data received in popup:", data);
            if (data && 'selector' in data && 'content' in data) {
                document.getElementById('currentSelector').textContent = 'Selector: ' + data.selector;
                document.getElementById('selectedContent').textContent = 'Content: ' + data.content;
            } else {
                document.getElementById('currentSelector').textContent = 'No selector stored for this page.';
                document.getElementById('selectedContent').textContent = 'No content captured';
            }
        }).catch(error => {
            console.error("Error in receiving data:", error);
        });
});


