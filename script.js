document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('urlInput');
  const previewBtn = document.getElementById('previewBtn');
  const previewFrame = document.getElementById('previewFrame');
  const placeholder = document.getElementById('placeholder');
  const errorMsg = document.getElementById('errorMsg');
  const tryProxyBtn = document.getElementById('tryProxyBtn');
  const cancelProxyBtn = document.getElementById('cancelProxyBtn');
  const openNewTabBtn = document.getElementById('openNewTabBtn');

  const PROXY_BASE = 'https://webview.xuanxuan860429.workers.dev/?url=';

  let currentUrl = '';

  function showPlaceholder() {
    placeholder.style.display = 'flex';
    previewFrame.style.display = 'none';
    errorMsg.style.display = 'none';
  }

  function loadIframe(src, fromProxy = false) {
    currentUrl = fromProxy 
      ? decodeURIComponent(src.split('?url=')[1] || src)
      : src;

    previewFrame.src = src;
    previewFrame.style.display = 'block';
    placeholder.style.display = 'none';
    errorMsg.style.display = 'none';
  }

  function showError() {
    previewFrame.style.display = 'none';
    placeholder.style.display = 'none';
    errorMsg.style.display = 'flex';
  }

  function tryProxy() {
    if (!currentUrl) return;
    const proxyUrl = PROXY_BASE + encodeURIComponent(currentUrl);
    loadIframe(proxyUrl, true);
  }

  function loadPreview() {
    let url = urlInput.value.trim();
    if (!url) {
      alert('喵～请输入一个链接哦！');
      return;
    }
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    currentUrl = url;
    loadIframe(url, false);  // 首次直接原 URL
  }

  previewFrame.addEventListener('error', showError);

  previewBtn.addEventListener('click', loadPreview);

  urlInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      loadPreview();
    }
  });

  urlInput.addEventListener('focus', () => {
    urlInput.select();
  });

  tryProxyBtn.addEventListener('click', tryProxy);

  openNewTabBtn.addEventListener('click', () => {
    if (currentUrl) {
      window.open(currentUrl, '_blank', 'noopener,noreferrer');
    }
    showPlaceholder();
  });

  cancelProxyBtn.addEventListener('click', showPlaceholder);
});