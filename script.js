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

    // 智能判断 X/Twitter 自动启用中转
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

  // ------------------ 新增：支持 ?url= 参数自动加载 ------------------
  function handleQueryParam() {
    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get('url');
    
    if (sharedUrl) {
      // 解码并填入输入框
      const decodedUrl = decodeURIComponent(sharedUrl);
      urlInput.value = decodedUrl;
      
      // 自动触发预览（你可以改成 false，只填入不自动加载）
      const autoPreview = true;  
      
      if (autoPreview) {
        loadPreview(true);  // true 表示自动模式，不弹 alert
      }
    }
  }

  // 页面加载完成后检查查询参数
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
