var _clipboard= null;
var _iptTitle = document.getElementById('linkTitle'),
    _iptURL   = document.getElementById('linkURL'),
    _btnCopy  = document.getElementById('btnCopy');

var onLinkChange = function(){
  var _title= _iptTitle.value.trim(),
      _url  = _iptURL.value.trim(),
      _link = '';

  _title= '['+_title+']';
  _url  = '('+_url+')';
  _link = _title + _url;

  _btnCopy.dataset.clipboardText = _link;
};

_iptTitle.addEventListener('input', onLinkChange, false);
_iptURL.addEventListener('input', onLinkChange, false);

_clipboard = new Clipboard('#btnCopy');

_clipboard.on('success', function(e) {
  _btnCopy.innerText = 'Copied';
  _btnCopy.disabled = true;
  setTimeout(function(){
    _btnCopy.innerText = 'Copy to Clipboard';
    _btnCopy.disabled = false;
  }, 1000);
});

_clipboard.on('error', function(e) {
  _btnCopy.innerText = 'Failed, please try again';
  _btnCopy.disabled = true;
  setTimeout(function(){
    _btnCopy.innerText = 'Copy to Clipboard';
    _btnCopy.disabled = false;
  }, 1000);
});

// 触发执行
chrome.tabs.query({
  currentWindow: true,
  active: true
}, function(tabs) {
  var tab = tabs[0];
  _iptTitle.value = tab.title;
  _iptURL.value = tab.url;
  onLinkChange();
});
