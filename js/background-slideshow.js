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
    this.audioContext = null;
    this.audioAnalyser = null;
    this.audioData = null;

    this.init();
  }

  init() {
    this.loadImages();
    this.createCanvas();
    this.initAudio();
    this.startRotation();
    this.animate();
  }

  initAudio() {
    // 初始化音频上下文（用于可视化）
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.audioAnalyser = this.audioContext.createAnalyser();
      this.audioAnalyser.fftSize = 256;
      this.audioData = new Uint8Array(this.audioAnalyser.frequencyBinCount);
    } catch (e) {
      console.warn('Audio API not supported');
    }
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

  drawAudioViz() {
    if (!this.audioAnalyser || !this.ctx) return;

    this.audioAnalyser.getByteFrequencyData(this.audioData);

    const { width, height } = this.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 50;

    this.ctx.save();

    // 绘制圆环
    const points = 120;
    const angleStep = (Math.PI * 2) / points;

    this.ctx.beginPath();
    for (let i = 0; i < points; i++) {
      const value = this.audioData[Math.floor(i / points * this.audioData.length)] || 0;
      const r = radius + value * 0.5;
      const angle = i * angleStep;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }

      // 绘制球体
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.closePath();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.lineWidth = 5;
    this.ctx.globalAlpha = 0.9;
    this.ctx.stroke();

    this.ctx.restore();
  }

  animate() {
    this.drawAudioViz();
    requestAnimationFrame(() => this.animate());
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
