# Price Tracker Extension Documentation

## Overview

The Price Tracker is a browser extension designed to allow users to select and track prices on various websites, receiving notifications when prices change. This document covers the basic framework setup of the extension.

## Installation Instructions

To install the extension in Firefox:

* Open Firefox and navigate to `about:debugging`.
* Click on "This Firefox" (or "Load Temporary Add-on").
* Browse to the location of your extension files and select any file within the extension folder (usually the `manifest.json`).
* The extension should now appear in your browser's toolbar.

## Current Functionality

As of now, the extension includes:

* A basic user interface (popup) that opens when you click the extension icon. It contains a button and a brief instructional text.
* A background script (background.js) that runs as long as the browser is open. Currently, it logs a message to the console.
* A content script (content.js) that can interact with web pages. It is set up to log a message when executed.

## Future Development

Future updates will focus on implementing a CSS selector tool and functionality for tracking and notifying price changes on webpages.
