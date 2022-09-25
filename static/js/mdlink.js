const iptTitle = document.getElementById('linkTitle')
const iptURL   = document.getElementById('linkURL')
const btnCopy  = document.getElementById('btnCopy')
const formatRadios = document.querySelectorAll('input[name="linkFormat"]')
const _clipboard = new Clipboard('#btnCopy');

function init() {
  iptTitle.addEventListener('input', onLinkChange)
  iptURL.addEventListener('input', onLinkChange)

  formatRadios.forEach(radio => {
    radio.addEventListener('change', onLinkChange)
  })

  _clipboard.on('success', e => {
    btnCopy.innerText = 'Copied'
    btnCopy.disabled = true
    setTimeout(() => {
      btnCopy.innerText = 'Copy to Clipboard'
      btnCopy.disabled = false
    }, 1000)
  })

  _clipboard.on('error', e => {
    btnCopy.innerText = 'Failed, please try again'
    btnCopy.disabled = true
    setTimeout(() => {
      btnCopy.innerText = 'Copy to Clipboard'
      btnCopy.disabled = false
    }, 1000)
  })
}

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

function onLinkChange() {
  const title= iptTitle.value.trim()
  const url  = iptURL.value.trim()
  const format = getLinkFormat()

  let link = ''
  switch (format) {
    case 'markdown':
      _link = `[${title}](${url})`
      break
    case 'chat':
      _link = `${url}\n${title}`
      break
  }
  btnCopy.dataset.clipboardText = _link;
}

function start() {
  // 触发执行
  chrome.tabs.query({
    currentWindow: true,
    active: true,
  }, tabs => {
    const tab = tabs[0]
    iptTitle.value = tab.title
    iptURL.value = tab.url
    setLinkFormat(getCachedLinkFormat() ?? 'markdown');
    onLinkChange()
    init()
  })
}

start()
