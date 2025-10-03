/**
 * 页面下半部分背景照片轮播
 * Background Slideshow for Page Content Area
 */

class BackgroundSlideshow {
  constructor() {
    this.images = [];
    this.currentIndex = 0;
    this.canvas = null;
    this.ctx = null;

    this.init();
  }

  init() {
    this.loadImages();
    this.createCanvas();
    this.startRotation();
  }

  loadImages() {
    // 加载32张壁纸
    const imageCount = 32;
    for (let i = 1; i <= imageCount; i++) {
      const img = new Image();
      img.src = `/images/wallpaper/${i}.jpg`;
      img.onload = () => {
        if (this.images.length === 1) {
          this.drawBackground(img);
        }
      };
      this.images.push(img);
    }
  }

  createCanvas() {
    // 创建全屏背景canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'bg-slideshow-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    `;
    document.body.insertBefore(this.canvas, document.body.firstChild);

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();

    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // 重新绘制当前图片
    const currentImg = this.images[this.currentIndex];
    if (currentImg && currentImg.complete) {
      this.drawBackground(currentImg);
    }
  }

  drawBackground(img) {
    if (!this.ctx) return;

    const { width, height } = this.canvas;
    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > canvasRatio) {
      drawHeight = height;
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = width;
      drawHeight = width / imgRatio;
      offsetX = 0;
      offsetY = (height - drawHeight) / 2;
    }

    this.ctx.clearRect(0, 0, width, height);
    this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  startRotation() {
    // 每1分钟切换一次图片
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      const img = this.images[this.currentIndex];
      if (img && img.complete) {
        this.drawBackground(img);
      }
    }, 60000); // 60秒
  }
}

// 初始化
(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new BackgroundSlideshow();
    });
  } else {
    new BackgroundSlideshow();
  }
})();
