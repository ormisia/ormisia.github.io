/**
 * 自定义导航菜单 - 添加到副标题下方
 */

(function() {
  function initCustomNav() {
    const siteInfo = document.querySelector('#page-header #site-info');
    if (!siteInfo) return;

    // 创建导航菜单
    const navMenu = document.createElement('div');
    navMenu.className = 'custom-nav-menu';
    navMenu.innerHTML = `
      <a href="/"><i class="fas fa-home"></i> 首页</a>
      <a href="/archives/"><i class="fas fa-archive"></i> 归档</a>
      <a href="/categories/"><i class="fas fa-folder-open"></i> 分类</a>
      <a href="/tags/"><i class="fas fa-tags"></i> 标签</a>
      <a href="/about/"><i class="fas fa-heart"></i> 关于</a>
    `;

    // 添加到页面头部
    const pageHeader = document.querySelector('#page-header');
    if (pageHeader) {
      pageHeader.appendChild(navMenu);
    }
  }

  // 等待DOM加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomNav);
  } else {
    initCustomNav();
  }
})();
