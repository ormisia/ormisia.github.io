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
    this.lastVolume = 0.7;

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
          this.renderPlaylist();
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
      <div class="audio-player-main">
        <div class="audio-player-info">
          <div class="audio-cover">
            <img src="/images/music-cover.jpg" alt="封面" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjNjY3ZWVhIi8+PHBhdGggZD0iTTMyIDEyYy0zIDAtNSAyLTUgNXYxNGMtMSAwLTIgMS0yIDJzMSAyIDIgMiAyLTEgMi0yVjIxbDEwLTNWMzBjLTEgMC0yIDEtMiAyczEgMiAyIDIgMi0xIDItMlYxNWMwLTEgMC0yLTEtMnoiIGZpbGw9IiNmZmYiLz48L3N2Zz4='">
          </div>
          <div class="audio-meta">
            <div class="audio-title">暂无音乐</div>
            <div class="audio-artist">未知艺术家</div>
          </div>
        </div>
        <div class="audio-controls">
          <button class="audio-btn audio-order" title="顺序播放">
            <i class="fas fa-redo"></i>
          </button>
          <button class="audio-btn audio-prev" title="上一曲">
            <i class="fas fa-step-backward"></i>
          </button>
          <button class="audio-btn audio-play" title="播放">
            <i class="fas fa-play"></i>
          </button>
          <button class="audio-btn audio-next" title="下一曲">
            <i class="fas fa-step-forward"></i>
          </button>
          <button class="audio-btn audio-list" title="播放列表">
            <i class="fas fa-list"></i>
          </button>
        </div>
        <div class="audio-progress-wrapper">
          <span class="audio-current-time">00:00</span>
          <div class="audio-progress-bar">
            <div class="audio-progress-loaded"></div>
            <div class="audio-progress-played"></div>
            <div class="audio-progress-thumb"></div>
          </div>
          <span class="audio-duration">00:00</span>
        </div>
        <div class="audio-volume-wrapper">
          <button class="audio-btn audio-volume-btn" title="音量">
            <i class="fas fa-volume-up"></i>
          </button>
          <div class="audio-volume-bar-wrap">
            <div class="audio-volume-bar">
              <div class="audio-volume-filled"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="audio-playlist" style="display: none;">
        <div class="audio-playlist-header">
          <span>播放列表</span>
          <button class="audio-playlist-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="audio-playlist-content"></div>
      </div>
    `;

    // 插入到footer之前
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

    // 播放列表按钮
    const listBtn = this.playerElement.querySelector('.audio-list');
    const playlist = this.playerElement.querySelector('.audio-playlist');
    listBtn.addEventListener('click', () => {
      playlist.style.display = playlist.style.display === 'none' ? 'block' : 'none';
    });

    // 关闭播放列表
    const closePlaylistBtn = this.playerElement.querySelector('.audio-playlist-close');
    closePlaylistBtn.addEventListener('click', () => {
      playlist.style.display = 'none';
    });

    // 进度条
    const progressBar = this.playerElement.querySelector('.audio-progress-bar');
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      this.seek(percent);
    });

    // 音量条
    const volumeBar = this.playerElement.querySelector('.audio-volume-bar');
    volumeBar.addEventListener('click', (e) => {
      const rect = volumeBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      this.setVolume(percent);
    });

    // 音量按钮
    const volumeBtn = this.playerElement.querySelector('.audio-volume-btn');
    volumeBtn.addEventListener('click', () => {
      if (this.audio.volume > 0) {
        this.lastVolume = this.audio.volume;
        this.setVolume(0);
      } else {
        this.setVolume(this.lastVolume || 0.7);
      }
    });
  }

  loadAudio(index) {
    if (index < 0 || index >= this.audioList.length) return;

    this.currentIndex = index;
    const audioFile = this.audioList[index];
    this.audio.src = audioFile.src;

    const titleElement = this.playerElement.querySelector('.audio-title');
    const artistElement = this.playerElement.querySelector('.audio-artist');
    titleElement.textContent = audioFile.name || `音乐 ${index + 1}`;
    artistElement.textContent = audioFile.artist || '未知艺术家';

    // 更新播放列表高亮
    this.updatePlaylistHighlight();

    // 如果之前在播放，加载后继续播放
    if (this.isPlaying) {
      this.audio.play();
    }
  }

  updatePlaylistHighlight() {
    const items = this.playerElement.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
      if (index === this.currentIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  renderPlaylist() {
    const playlistContent = this.playerElement.querySelector('.audio-playlist-content');
    playlistContent.innerHTML = this.audioList.map((audio, index) => `
      <div class="playlist-item ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
        <span class="playlist-index">${index + 1}</span>
        <span class="playlist-name">${audio.name || `音乐 ${index + 1}`}</span>
        <span class="playlist-artist">${audio.artist || '未知艺术家'}</span>
      </div>
    `).join('');

    // 绑定播放列表项点击事件
    playlistContent.querySelectorAll('.playlist-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        this.loadAudio(index);
        this.play();
      });
    });
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
    const volumeFilled = this.playerElement.querySelector('.audio-volume-filled');
    volumeFilled.style.width = `${volume * 100}%`;

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
    const progressPlayed = this.playerElement.querySelector('.audio-progress-played');
    const progressThumb = this.playerElement.querySelector('.audio-progress-thumb');
    progressPlayed.style.width = `${percent}%`;
    progressThumb.style.left = `${percent}%`;

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
