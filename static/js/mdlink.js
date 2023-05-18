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

function getLinkFormat() {
  for (let i = 0; i < formatRadios.length; i++) {
    if (formatRadios[i].checked) {
      return formatRadios[i].value
    }
  }
  return 'markdown'
}

function onLinkChange() {
  const title= iptTitle.value.trim()
  const url  = iptURL.value.trim()
  const format = getLinkFormat()

  let link = ''
  switch (format) {
    case 'markdown':
      link = `[${title}](${url})`
      break
    case 'chat':
      link = `${url}\n${title}`
      break
    // case 'link':
    //   link = ''
  }
  if (link) {
    btnCopy.dataset.clipboardText = link;
  }
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
    onLinkChange()
    init()
  })
}

start()
