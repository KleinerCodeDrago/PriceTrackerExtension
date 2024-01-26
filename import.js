document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        browser.runtime.sendMessage({action: "importData", data: data});
    };
    reader.readAsText(file);
});
