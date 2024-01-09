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
