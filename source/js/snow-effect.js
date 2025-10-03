/**
 * 全局飘雪效果
 * Global Snow Effect for All Pages
 */

class SnowEffect {
  constructor(options = {}) {
    this.config = {
      snowflakeCount: options.count || 80,        // 雪花数量
      maxSize: options.maxSize || 5,              // 最大尺寸
      minSize: options.minSize || 2,              // 最小尺寸
      maxSpeed: options.maxSpeed || 2,            // 最大速度
      minSpeed: options.minSpeed || 0.5,          // 最小速度
      color: options.color || 'rgba(255, 255, 255, 0.8)', // 颜色
      zIndex: options.zIndex || -1                // 层级
    };

    this.canvas = null;
    this.ctx = null;
    this.snowflakes = [];
    this.animationFrame = null;

    this.init();
  }

  init() {
    this.createCanvas();
    this.createSnowflakes();
    this.animate();
    this.handleResize();
  }

  createCanvas() {
    // 创建全屏canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'snow-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: ${this.config.zIndex};
    `;

    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.resizeCanvas();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  handleResize() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      // 重新创建雪花以适应新尺寸
      this.createSnowflakes();
    });
  }

  createSnowflakes() {
    this.snowflakes = [];
    const { snowflakeCount, maxSize, minSize, maxSpeed, minSpeed } = this.config;

    for (let i = 0; i < snowflakeCount; i++) {
      this.snowflakes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * (maxSize - minSize) + minSize,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
        swing: Math.random() * 0.5 - 0.25, // 左右摆动
        swingSpeed: Math.random() * 0.01,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }

  updateSnowflakes() {
    this.snowflakes.forEach(flake => {
      // 下落
      flake.y += flake.speed;

      // 左右摆动
      flake.x += Math.sin(flake.y * flake.swingSpeed) * flake.swing;

      // 重置到顶部
      if (flake.y > this.canvas.height) {
        flake.y = -10;
        flake.x = Math.random() * this.canvas.width;
      }

      // 边界检测
      if (flake.x > this.canvas.width) {
        flake.x = 0;
      } else if (flake.x < 0) {
        flake.x = this.canvas.width;
      }
    });
  }

  drawSnowflakes() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.snowflakes.forEach(flake => {
      this.ctx.save();
      this.ctx.globalAlpha = flake.opacity;
      this.ctx.beginPath();
      this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.config.color;
      this.ctx.fill();

      // 添加微弱的光晕效果
      this.ctx.shadowBlur = 3;
      this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
      this.ctx.fill();

      this.ctx.restore();
    });
  }

  animate() {
    this.updateSnowflakes();
    this.drawSnowflakes();
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// 初始化飘雪效果
(function() {
  // 等待DOM加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSnow);
  } else {
    initSnow();
  }

  function initSnow() {
    // 创建飘雪效果实例
    window.snowEffect = new SnowEffect({
      count: 100,           // 雪花数量
      maxSize: 4,           // 最大尺寸
      minSize: 1,           // 最小尺寸
      maxSpeed: 1.5,        // 最大速度
      minSpeed: 0.3,        // 最小速度
      color: 'rgba(255, 255, 255, 0.8)',
      zIndex: 9999          // 确保在最上层
    });
  }
})();
