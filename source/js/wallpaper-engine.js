/**
 * Wallpaper Engine for Hexo Blog
 * 完整复刻 Wallpaper Engine 动态壁纸效果
 */

class WallpaperEngine {
  constructor() {
    this.config = {
      // 图片轮播配置
      wallpaperMode: 1, // 1=自定义目录轮播
      transitionMode: 1, // 过渡模式
      imageSwitchTimes: 1, // 切换时间(分钟)
      imageDisplayStyle: 1, // 显示样式

      // 粒子配置
      particles: {
        enable: true,
        number: 84,
        color: 'rgba(192, 192, 192, 0.82)',
        size: 5,
        sizeRandom: true,
        opacity: 0.82,
        opacityRandom: true,
        speed: 2,
        speedRandom: true,
        direction: 6, // 随机方向
        isMove: true,
        isBounce: false,
        linkEnable: false,
        linkDistance: 75,
        linkColor: 'rgba(255, 255, 0, 0.75)',
        linkWidth: 3,
        linkOpacity: 0.75
      },

      // 音频可视化配置
      audioViz: {
        enable: true,
        model: 2, // 可视化模式
        processing: true,
        amplitude: 5,
        decline: 20,
        pointNum: 120,
        isRing: true,
        isInnerRing: true,
        isOuterRing: true,
        isBall: true,
        ringRotation: 0,
        ballRotation: 0,
        radius: 5,
        ballSize: 3,
        ballSpacer: 4,
        lineWidth: 5,
        color: 'rgba(255, 255, 255, 0.9)',
        opacity: 0.9,
        offsetX: 50,
        offsetY: 50
      },

      // 时间显示配置
      time: {
        show: true,
        showSeconds: true,
        x: 86,
        y: 61,
        size: 18,
        color: 'rgba(255, 255, 255, 1)',
        blurColor: 'rgba(192, 192, 192, 0.75)',
        transparency: 100,
        style: true
      },

      // 日期显示配置
      date: {
        show: true,
        x: 86,
        y: 70,
        size: 15,
        format: 15 // 日期格式
      },

      // 天气显示配置
      weather: {
        show: true,
        city: '西安',
        x: 86,
        y: 66,
        size: 10,
        format: 3,
        color: 'rgba(250, 250, 250, 0.98)',
        blurColor: 'rgba(192, 192, 192, 0.75)'
      },

      // 波形线配置
      pwLine: {
        show: true,
        style: 1,
        position: 1,
        direction: 1,
        density: 12,
        range: 10,
        spacing: 10,
        width: 9,
        transparency: 80,
        x: 100,
        y: 95,
        color: 'rgba(255, 255, 255, 1)',
        blurColor: 'rgba(192, 192, 192, 0.75)',
        colorMode: 1,
        colorRhythm: true,
        solidColorGradient: true,
        blurColorGradient: true,
        gradientRate: 5
      }
    };

    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.images = [];
    this.currentImageIndex = 0;
    this.audioContext = null;
    this.audioAnalyser = null;
    this.audioData = null;

    this.init();
  }

  init() {
    this.createCanvas();
    this.loadImages();
    this.initParticles();
    this.initAudio();
    this.animate();
    this.startImageRotation();
  }

  createCanvas() {
    // 创建全屏canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'wallpaper-canvas';
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
  }

  loadImages() {
    // 加载所有壁纸图片
    const imageCount = 32; // 根据实际图片数量
    for (let i = 1; i <= imageCount; i++) {
      const img = new Image();
      img.src = `/images/wallpaper/${i}.jpg`;
      img.onload = () => {
        if (this.images.length === 0) {
          this.drawBackground(img);
        }
      };
      this.images.push(img);
    }
  }

  drawBackground(img) {
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

    this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  initParticles() {
    const { particles } = this.config;
    if (!particles.enable) return;

    for (let i = 0; i < particles.number; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * particles.speed,
        vy: (Math.random() - 0.5) * particles.speed,
        size: particles.sizeRandom ? Math.random() * particles.size : particles.size,
        opacity: particles.opacityRandom ? Math.random() * particles.opacity : particles.opacity
      });
    }
  }

  drawParticles() {
    const { particles } = this.config;
    if (!particles.enable) return;

    this.ctx.save();

    this.particles.forEach((particle, i) => {
      // 更新位置
      particle.x += particle.vx;
      particle.y += particle.vy;

      // 边界检测
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      // 绘制粒子
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particles.color.replace(/[\d.]+\)$/, particle.opacity + ')');
      this.ctx.fill();

      // 连线
      if (particles.linkEnable) {
        this.particles.slice(i + 1).forEach(other => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < particles.linkDistance) {
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(other.x, other.y);
            this.ctx.strokeStyle = particles.linkColor;
            this.ctx.lineWidth = particles.linkWidth;
            this.ctx.stroke();
          }
        });
      }
    });

    this.ctx.restore();
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

  drawAudioViz() {
    const { audioViz } = this.config;
    if (!audioViz.enable || !this.audioAnalyser) return;

    this.audioAnalyser.getByteFrequencyData(this.audioData);

    const { width, height } = this.canvas;
    const centerX = width * audioViz.offsetX / 100;
    const centerY = height * audioViz.offsetY / 100;
    const radius = audioViz.radius * 10;

    this.ctx.save();
    this.ctx.translate(centerX, centerY);

    // 绘制圆环
    if (audioViz.isRing) {
      const points = audioViz.pointNum;
      const angleStep = (Math.PI * 2) / points;

      this.ctx.beginPath();
      for (let i = 0; i < points; i++) {
        const value = this.audioData[Math.floor(i / points * this.audioData.length)] || 0;
        const r = radius + value * audioViz.amplitude / 10;
        const angle = i * angleStep + audioViz.ringRotation * Math.PI / 180;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;

        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }

        // 绘制球体
        if (audioViz.isBall) {
          this.ctx.beginPath();
          this.ctx.arc(x, y, audioViz.ballSize, 0, Math.PI * 2);
          this.ctx.fillStyle = audioViz.color;
          this.ctx.fill();
        }
      }

      this.ctx.closePath();
      this.ctx.strokeStyle = audioViz.color;
      this.ctx.lineWidth = audioViz.lineWidth;
      this.ctx.globalAlpha = audioViz.opacity;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  drawTime() {
    const { time } = this.config;
    if (!time.show) return;

    const now = new Date();
    let timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (time.showSeconds) {
      timeStr += `:${String(now.getSeconds()).padStart(2, '0')}`;
    }

    const x = this.canvas.width * time.x / 100;
    const y = this.canvas.height * time.y / 100;

    this.ctx.save();
    this.ctx.font = `${time.size * 4}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // 阴影/模糊效果
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = time.blurColor;

    this.ctx.fillStyle = time.color;
    this.ctx.globalAlpha = time.transparency / 100;
    this.ctx.fillText(timeStr, x, y);

    this.ctx.restore();
  }

  drawDate() {
    const { date } = this.config;
    if (!date.show) return;

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const x = this.canvas.width * date.x / 100;
    const y = this.canvas.height * date.y / 100;

    this.ctx.save();
    this.ctx.font = `${date.size * 3}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.fillText(dateStr, x, y);
    this.ctx.restore();
  }

  animate() {
    // 清除画布（保留背景）
    const bgImg = this.images[this.currentImageIndex];
    if (bgImg && bgImg.complete) {
      this.drawBackground(bgImg);
    }

    // 绘制各种特效
    this.drawParticles();
    this.drawAudioViz();
    this.drawTime();
    this.drawDate();

    requestAnimationFrame(() => this.animate());
  }

  startImageRotation() {
    const interval = this.config.imageSwitchTimes * 60 * 1000;
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }, interval);
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  new WallpaperEngine();
});
