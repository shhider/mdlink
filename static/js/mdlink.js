const iptTitle = document.getElementById('linkTitle');
const iptURL = document.getElementById('linkURL');
const formatRadios = document.querySelectorAll('input[name="linkFormat"]');
const btnCopy = document.getElementById('btnCopy');

function init() {
  btnCopy.addEventListener('click', doCopy);
}

// #region do copy via navigator.clipboard
function doCopy() {
  const taskCopy = (() => {
    if (!isClipboardSupported()) {
      return Promise.reject('Cannot reach clipboard API');
    }
    btnCopy.disabled = true;

    const title = iptTitle.value.trim();
    const link = iptURL.value.trim();
    const format = getLinkFormat();

    switch (format) {
      case 'html-a-link': return copyLinkInHTML({ link, title });
      case 'markdown': return copyLinkInText(`[${title}](${link})`);
      case 'chat': return copyLinkInText(`${link}\n${title}`);
      default: return Promise.reject('unknown format');
    }
  })();

  taskCopy
    .then(
      () => showBtnAlert('copied', true),
      (err) => {
        const alert = typeof err === 'string' ? err : err.message;
        showBtnAlert(alert || 'failed', false);
      }
    ).then(resetBtnIn1Sec);
}

async function copyLinkInHTML({ link, title }) {
  const htmlLink = `<a href="${link}">${title}</a>`;
  const data = new ClipboardItem({
    'text/html': new Blob([htmlLink], { type: "text/html" }),
    'text/plain': new Blob([title], { type: 'text/plain' }),
  });
  return navigator.clipboard.write([data]);
}

async function copyLinkInText(txtToCopy) {
  return navigator.clipboard.writeText(txtToCopy);
}

function isClipboardSupported() {
  let supported = false;
  try {
    supported = ClipboardItem.supports('text/html') && navigator.clipboard != null;
  } catch (_err) {
    //
  }
  return supported;
}
// #endregion

// #region linkFormat
function getLinkFormat() {
  for (let i = 0; i < formatRadios.length; i++) {
    if (formatRadios[i].checked) {
      const fmt = formatRadios[i].value;
      cacheLinkFormat(fmt);
      return fmt;
    }
  }
  return 'markdown'
}

function setLinkFormat(format) {
  for (let i = 0; i < formatRadios.length; i++) {
    const item = formatRadios[i];
    if (item.value === format) {
      item.click();
    }
  }
}

const FORMAT_CACHE_KEY = 'last_format';
function cacheLinkFormat(format) {
  const fmt = format.trim().toLowerCase();
  if (fmt) {
    localStorage[FORMAT_CACHE_KEY] = fmt;
  }
}

function getCachedLinkFormat() {
  return localStorage[FORMAT_CACHE_KEY] ?? undefined;
}
// #endregion

// #region button status
const btnAlert = document.getElementById('btnAlert');
const colorSuccess = '#0a0';
const colorFailed = '#ff4d4f';
function showBtnAlert(txt, isSuccess) {
  btnAlert.innerText = txt;
  btnAlert.style.color = isSuccess ? colorSuccess : colorFailed;
}

async function resetBtnIn1Sec() {
  return new Promise((resolve) => {
    setTimeout(() => {
      showBtnAlert('', true);
      btnCopy.disabled = false;
      resolve(true);
    }, 1000);
  });
}
// #endregion

function start() {
  // 触发执行
  chrome.tabs.query({
    currentWindow: true,
    active: true,
  }, tabs => {
    const tab = tabs[0];
    iptTitle.value = tab.title;
    iptURL.value = tab.url;
    setLinkFormat(getCachedLinkFormat() ?? 'markdown');
    init();
  });
}

start();
