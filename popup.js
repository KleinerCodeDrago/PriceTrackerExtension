document.getElementById('selectPrice').addEventListener('click', () => {
    browser.tabs.executeScript({
      code: `console.log("Element selection mode activated.");`
      // Later, replace this with code to enable CSS selector tool
    });
  });
  