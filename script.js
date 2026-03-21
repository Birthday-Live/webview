document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('urlInput');
  const previewBtn = document.getElementById('previewBtn');
  const previewFrame = document.getElementById('previewFrame');
  const placeholder = document.getElementById('placeholder');
  const errorMsg = document.getElementById('errorMsg');
  const tryProxyBtn = document.getElementById('tryProxyBtn');
  const cancelProxyBtn = document.getElementById('cancelProxyBtn');
  const openNewTabBtn = document.getElementById('openNewTabBtn');
  const useProxyCheckbox = document.getElementById('useProxyCheckbox');

  const PROXY_BASE = 'https://webview.chisato.org.cn?url=';

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

  function loadPreview(auto = false) {
    let url = urlInput.value.trim();
    if (!url) {
      if (!auto) alert('喵～请输入一个链接哦！');
      return;
    }
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    currentUrl = url;

    // 自动判断 X.com / twitter.com 链接，强制中转
    const isXSite = url.includes('x.com') || url.includes('twitter.com');
    if (isXSite) {
      useProxyCheckbox.checked = true;
    }

    const useProxy = useProxyCheckbox.checked;

    if (useProxy) {
      const proxyUrl = PROXY_BASE + encodeURIComponent(url);
      loadIframe(proxyUrl, true);
    } else {
      loadIframe(url, false);
    }
  }

  // ── 支持直接通过 ?url= 参数打开预览 ──
  function handleQueryParam() {
    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get('url');

    if (sharedUrl) {
      let target = decodeURIComponent(sharedUrl);

      // 如果是嵌套的 Worker 链接，尝试提取最内层的真实目标网址
      if (target.includes('?url=')) {
        const innerParams = new URLSearchParams(target.split('?')[1] || '');
        const innerUrl = innerParams.get('url');
        if (innerUrl) {
          target = decodeURIComponent(innerUrl);
        }
      }

      // 填入输入框
      urlInput.value = target;

      // 自动勾选中转（因为带 ?url= 通常希望能成功显示）
      useProxyCheckbox.checked = false;

      // 自动触发预览（不弹 alert）
      loadPreview(true);
    }
  }

  // 页面加载时立即检查是否有 ?url= 参数
  handleQueryParam();

  // 事件绑定
  previewFrame.addEventListener('error', showError);

  previewBtn.addEventListener('click', () => loadPreview(false));

  urlInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      loadPreview(false);
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
