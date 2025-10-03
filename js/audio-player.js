/**
 * 全局音频播放器
 * Global Audio Player
 */

class GlobalAudioPlayer {
  constructor() {
    this.audioList = [];
    this.currentIndex = 0;
    this.audio = null;
    this.isPlaying = false;
    this.playerElement = null;

    this.init();
  }

  init() {
    this.loadAudioList();
    this.createPlayer();
    this.initAudio();
  }

  loadAudioList() {
    // 从 playlist.json 加载音频列表
    fetch('/music/playlist.json')
      .then(response => response.json())
      .then(data => {
        this.audioList = data;
        if (this.audioList.length > 0) {
          this.loadAudio(0);
          // 自动播放第一首
          this.play();
        }
      })
      .catch(error => {
        console.log('播放列表加载失败，请在 source/music/ 目录添加音频文件');
        this.audioList = [];
      });
  }

  createPlayer() {
    // 创建播放器容器
    this.playerElement = document.createElement('div');
    this.playerElement.id = 'global-audio-player';
    this.playerElement.innerHTML = `
      <div class="audio-player-container">
        <div class="audio-controls">
          <button class="audio-btn audio-prev" title="上一曲">
            <i class="fas fa-step-backward"></i>
          </button>
          <button class="audio-btn audio-play" title="播放/暂停">
            <i class="fas fa-play"></i>
          </button>
          <button class="audio-btn audio-next" title="下一曲">
            <i class="fas fa-step-forward"></i>
          </button>
        </div>
        <div class="audio-info">
          <div class="audio-title">暂无音乐</div>
          <div class="audio-progress-container">
            <span class="audio-current-time">00:00</span>
            <div class="audio-progress-bar">
              <div class="audio-progress-filled"></div>
            </div>
            <span class="audio-duration">00:00</span>
          </div>
        </div>
        <div class="audio-volume">
          <button class="audio-btn audio-volume-btn" title="音量">
            <i class="fas fa-volume-up"></i>
          </button>
          <input type="range" class="audio-volume-slider" min="0" max="100" value="70">
        </div>
        <button class="audio-btn audio-close" title="关闭播放器">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    // 插入到页面主要内容后、footer之前
    const waitForFooter = setInterval(() => {
      const footer = document.querySelector('#footer');
      if (footer) {
        clearInterval(waitForFooter);
        footer.parentNode.insertBefore(this.playerElement, footer);
        this.bindEvents();
      }
    }, 100);
  }

  initAudio() {
    this.audio = new Audio();
    this.audio.volume = 0.7;
    this.audio.loop = false; // 单曲不循环，由播放器控制列表循环

    // 音频事件
    this.audio.addEventListener('ended', () => {
      this.next();
    });

    this.audio.addEventListener('timeupdate', () => {
      this.updateProgress();
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.updateDuration();
    });

    // 如果有音频列表，加载第一首
    if (this.audioList.length > 0) {
      this.loadAudio(0);
    }
  }

  bindEvents() {
    // 播放/暂停
    const playBtn = this.playerElement.querySelector('.audio-play');
    playBtn.addEventListener('click', () => {
      this.togglePlay();
    });

    // 上一曲
    const prevBtn = this.playerElement.querySelector('.audio-prev');
    prevBtn.addEventListener('click', () => {
      this.prev();
    });

    // 下一曲
    const nextBtn = this.playerElement.querySelector('.audio-next');
    nextBtn.addEventListener('click', () => {
      this.next();
    });

    // 进度条
    const progressBar = this.playerElement.querySelector('.audio-progress-bar');
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      this.seek(percent);
    });

    // 音量
    const volumeSlider = this.playerElement.querySelector('.audio-volume-slider');
    volumeSlider.addEventListener('input', (e) => {
      this.setVolume(e.target.value / 100);
    });

    // 关闭播放器
    const closeBtn = this.playerElement.querySelector('.audio-close');
    closeBtn.addEventListener('click', () => {
      this.close();
    });
  }

  loadAudio(index) {
    if (index < 0 || index >= this.audioList.length) return;

    this.currentIndex = index;
    const audioFile = this.audioList[index];
    this.audio.src = audioFile.src;

    const titleElement = this.playerElement.querySelector('.audio-title');
    titleElement.textContent = audioFile.name || `音乐 ${index + 1}`;

    // 如果之前在播放，加载后继续播放
    if (this.isPlaying) {
      this.audio.play();
    }
  }

  togglePlay() {
    if (!this.audio.src) return;

    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.audio.play();
    this.isPlaying = true;
    const playBtn = this.playerElement.querySelector('.audio-play i');
    playBtn.className = 'fas fa-pause';
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    const playBtn = this.playerElement.querySelector('.audio-play i');
    playBtn.className = 'fas fa-play';
  }

  prev() {
    let newIndex = this.currentIndex - 1;
    if (newIndex < 0) {
      newIndex = this.audioList.length - 1;
    }
    this.loadAudio(newIndex);
  }

  next() {
    let newIndex = this.currentIndex + 1;
    if (newIndex >= this.audioList.length) {
      newIndex = 0; // 循环播放
    }
    this.loadAudio(newIndex);
  }

  seek(percent) {
    if (!this.audio.duration) return;
    this.audio.currentTime = this.audio.duration * percent;
  }

  setVolume(volume) {
    this.audio.volume = volume;
    const volumeBtn = this.playerElement.querySelector('.audio-volume-btn i');
    if (volume === 0) {
      volumeBtn.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
      volumeBtn.className = 'fas fa-volume-down';
    } else {
      volumeBtn.className = 'fas fa-volume-up';
    }
  }

  updateProgress() {
    if (!this.audio.duration) return;

    const percent = (this.audio.currentTime / this.audio.duration) * 100;
    const progressFilled = this.playerElement.querySelector('.audio-progress-filled');
    progressFilled.style.width = `${percent}%`;

    const currentTime = this.playerElement.querySelector('.audio-current-time');
    currentTime.textContent = this.formatTime(this.audio.currentTime);
  }

  updateDuration() {
    const duration = this.playerElement.querySelector('.audio-duration');
    duration.textContent = this.formatTime(this.audio.duration);
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  close() {
    this.pause();
    this.playerElement.style.display = 'none';
  }
}

// 初始化播放器（使用单例模式，确保页面切换时不重新创建）
(function() {
  if (!window.globalAudioPlayer) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.globalAudioPlayer = new GlobalAudioPlayer();
      });
    } else {
      window.globalAudioPlayer = new GlobalAudioPlayer();
    }
  }
})();
