<p align="center">
  <img src="https://i.postimg.cc/3wyrk8fb/block-zone-classic-1024px-transparent-1.png" alt="BlockZone Logo" width="128"/>
</p>

<h1 align="center">BlockZone - Browser Extension</h1>

<p align="center">
  A Chromium-based browser extension to block unwanted websites.
</p>

---

## Description

**BlockZone** is a browser extension designed to block access to sites from a customizable list. It uses the modern `declarativeNetRequest` API (Manifest V3) for efficient and safe blocking without accessing your web traffic.

## Key Features

* **Site Blocking:** Denies access to domains on the blocklist.
* **Quick Add:** Add the currently visited site to the list via the extension's popup.
* **List Management:** A convenient options page for adding/removing sites.
* **Presets:** Load a predefined list of common distracting websites.
* **Operating Modes:**
    * **Blacklist:** Blocks only the sites listed.
    * **Whitelist:** Blocks ALL sites *except* those listed.
* **Password Protection:** The options page is secured with a password.
* **Security (Manifest V3):** Uses `declarativeNetRequest`, requiring no permissions to read page data.
* **Custom Block Page:** Displays a motivational placeholder instead of the blocked site.

## Installation (Locally)

1.  **Clone the repository** or download the ZIP archive and unzip it.
2.  Open your browser (Chrome, Edge, Brave, etc.).
3.  Navigate to the extensions page (usually `chrome://extensions` or `edge://extensions`).
4.  Enable **"Developer mode"** in the top right corner.
5.  Click the **"Load unpacked"** button.
6.  Select the folder containing the extension's code.
7.  The extension is installed. Pin its icon to your toolbar.

## Usage

* **Quick Block:** While on a site you wish to block, click the extension's icon and then the "Add to list" button.
* **Manage List:** Right-click the extension icon -> "Options". Enter your password (set it on first entry). Manage the list, load presets, and change the operating mode.

## Technologies

* **Languages:** HTML, CSS, JavaScript
* **Extension APIs:** Chrome Manifest V3, `declarativeNetRequest`, `storage`, `activeTab`

## Developed By

<p align="center">
  <img src="https://i.postimg.cc/j2FLVbY4/hru-hru-logo.png" alt="Hru Hru Studio Logo" width="80"/>
  <br/>
  <strong>HruHruStudio</strong>
  <br/>
  <a href="http://hruhrustudio.site">Developer Site</a>
</p>
