function doCopy(text) {
  const elem = document.createElement('textarea');
  elem.value = text;
  document.body.append(elem);

  elem.select();
  const success = document.execCommand('copy');
  elem.remove();

  return success;
}

function setUpContextMenus() {
  chrome.contextMenus.create({
    title: 'Copy Link in Format:  [Title](Link)',
    contexts: ['link'],
    id: 'mklink-md',
    documentUrlPatterns: ['http://*/*', 'https://*/*'],
  });

  chrome.contextMenus.create({
    title: 'Copy Link in Format:  Link \\n Title',
    contexts: ['link'],
    id: 'mklink-multiline',
    documentUrlPatterns: ['http://*/*', 'https://*/*'],
  });
}

chrome.runtime.onInstalled.addListener(() => {
  // When the app gets installed, set up the context menus
  setUpContextMenus();
});

chrome.contextMenus.onClicked.addListener((itemData) => {
  const { menuItemId, linkUrl: link, selectionText: text } = itemData;
  let linkText = '';
  switch (menuItemId) {
    case 'mklink-multiline':
      linkText = `${link}\n${text}`;
      break;
    case 'mklink-md':
    default:
      linkText = `[${text}](${link})`;
      break;
  }

  doCopy(linkText);
});
