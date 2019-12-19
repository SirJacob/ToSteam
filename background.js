function sendToSteam(URL) {
    // This is a fancy way of prompting the user to allow us to send our command to open this URL to the Steam client
    Object.assign(document.createElement('a'),
        {target: '_blank', href: 'steam://openurl/' + URL}).click();
}

/* ===== ENABLE EXTENSION ICON (UN-GRAYSCALE) ===== */
function setup_extensionIcon() {
    // Rules for page-matching; tells Chrome when to enable extension icon
    let rule1 = {
        conditions: [
            // TODO: Make conditions more accurate, like the contextPatterns below
            new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostSuffix: 'steampowered.com'}
            }),
            new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostSuffix: 'steamcommunity.com'}
            })
        ],
        actions: [
            new chrome.declarativeContent.ShowPageAction() // Un-grayscale the logo
        ]
    };

    // onInstalled is called when the extension is installed or updated
    chrome.runtime.onInstalled.addListener(function (details) {
        chrome.declarativeContent.onPageChanged.removeRules(undefined, function () { // Remove old rules...
            chrome.declarativeContent.onPageChanged.addRules([rule1]); // ...before adding new ones.
        });
    });
}

/* ===== CONTEXT MENU ITEM ===== */
function setup_contextMenuItem() {
    contextPatterns = [ // The context menu will only appear on these pages/links
        "https://steampowered.com/*",
        "https://*.steampowered.com/*",
        "https://steamcommunity.com/*",
        "https://*.steamcommunity.com/*"
    ];
    let contextMenuItem = {
        "id": "ToSteam_eventPage_contextMenuItem",
        "title": "Send Site to Steam", // Text to be displayed in the context menu
        "contexts": ["page", "link"], // Only allow links and pages themselves to be sent to Steam
        "visible": true,
        "documentUrlPatterns": contextPatterns,
        "targetUrlPatterns": contextPatterns
    };
    chrome.contextMenus.removeAll(); // Ensures no duplicates of our context menu item
    chrome.contextMenus.create(contextMenuItem); // Hand off our context menu to Chrome
    // Create a listener for when our context menu item is clicked
    chrome.contextMenus.onClicked.addListener(function (callback) {
        /* Since links only exist on pages, lets check to see if the user right-clicked on a link, if not,
        we'll use the page's URL instead. */
        sendToSteam(callback.linkUrl === undefined ? callback.pageUrl : callback.linkUrl)
    });
}

setup_extensionIcon();
setup_contextMenuItem();