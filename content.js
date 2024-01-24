let isSelectingElement = false;

function enableElementSelection() {
    isSelectingElement = true;
    document.addEventListener('click', elementSelectionHandler, {once: true});
}

function elementSelectionHandler(e) {
    if (!isSelectingElement) {
        return;
    }

    e.preventDefault();
    e.stopPropagation();
    isSelectingElement = false;

    let path = getPathTo(e.target);
    highlightElement(e.target);

    browser.runtime.sendMessage({
        action: "storeSelector",
        url: window.location.href,
        selector: path,
        content: e.target.innerText
    });
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "selectElement") {
        enableElementSelection();
    }
});


function getPathTo(element) {
    if (element.id) {
        return `#${element.id}`;
    }

    let path = '';
    let currentElement = element;

    while (currentElement.tagName !== 'BODY') {
        let selector = currentElement.tagName.toLowerCase();
        if (currentElement.className) {
            selector += '.' + Array.from(currentElement.classList).join('.');
        }
        let elements = currentElement.parentNode.querySelectorAll(selector);
        if (elements.length === 1) {
            path = selector + (path ? ' > ' + path : '');
            break;
        } else {
            let index = Array.from(elements).indexOf(currentElement) + 1;
            selector += `:nth-child(${index})`;
            path = selector + (path ? ' > ' + path : '');
            currentElement = currentElement.parentNode;
        }
    }

    return path;
}

function highlightElement(element) {
    const originalBorder = element.style.border;
    element.style.border = '2px solid red';

    setTimeout(() => {
        element.style.border = originalBorder;
    }, 2000);
}