// Saves options to Chrome Sync
function save_options() {
    let closeTabOnSend = document.getElementById('closeTabOnSend').checked;
    chrome.storage.sync.set({
        closeTabOnSend: closeTabOnSend
    }, function () {
        // Update status to let user know options were saved.
        let status = document.getElementById('save');
        status.textContent = 'Saved!';
        setTimeout(function () {
            status.textContent = 'Save';
        }, 1000);
    });
}

// Restore data saved in chrome.storage to options window
function restore_options() {
    // Default values if no sync data is found
    chrome.storage.sync.get({
        closeTabOnSend: true,
    }, function (items) {
        // .value can be used in other instances
        document.getElementById('closeTabOnSend').checked = items.closeTabOnSend;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);