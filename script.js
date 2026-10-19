/* ============================================================
   SHERIF IBRAHIM — MUSIC PLAYER SCRIPTS
   ============================================================ */

const songs = [
  {
    title: 'American Darlings',
    artist: 'S.A.D. - Acoustic',
    src: 'assets/music/song1.mp3',
    cover: 'assets/images/cover1.jpg' // Eagle Hunter
  },
  {
    title: 'Happiness In Music',
    artist: 'Chill',
    src: 'assets/music/song2.mp3',
    cover: 'assets/images/cover3.jpg' // Fashion Models
  },
  {
    title: 'Artificial Rain',
    artist: 'Lo-Fi Astronaut (LoFi, Chill)',
    src: 'assets/music/song3.mp3',
    cover: 'assets/images/cover2.jpg' // Fisherman
  }
];

/* --- DOM Elements --- */
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');

const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const albumArt = document.getElementById('albumArt');
const playlist = document.getElementById('playlist');

const progressBarWrapper = document.querySelector('.progress-bar-wrapper');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');

const volumeSlider = document.getElementById('volumeSlider');
const muteBtn = document.getElementById('muteBtn');
const volOnIcon = document.getElementById('volOnIcon');

/* --- State --- */
let songIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

/* --- Initialize --- */
function loadSong(index) {
  const song = songs[index];
  trackTitle.textContent = song.title;
  trackArtist.textContent = song.artist;
  albumArt.src = song.cover;
  audio.src = song.src;
  
  // Update playlist active state
  document.querySelectorAll('.playlist-item').forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });
}

function renderPlaylist() {
  playlist.innerHTML = '';
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.className = `playlist-item ${index === songIndex ? 'active' : ''}`;
    li.innerHTML = `
      <img src="${song.cover}" alt="${song.title}" class="playlist-img">
      <div class="playlist-info">
        <span class="playlist-title-text">${song.title}</span>
        <span class="playlist-artist-text">${song.artist}</span>
      </div>
    `;
    li.addEventListener('click', () => {
      songIndex = index;
      loadSong(songIndex);
      playAudio();
    });
    playlist.appendChild(li);
  });
}

/* --- Play / Pause --- */
function playAudio() {
  isPlaying = true;
  audio.play().catch(e => console.log("Playback prevented:", e)); // Safeguard
  playIcon.style.display = 'none';
  pauseIcon.style.display = 'block';
  albumArt.classList.add('playing');
}

function pauseAudio() {
  isPlaying = false;
  audio.pause();
  playIcon.style.display = 'block';
  pauseIcon.style.display = 'none';
  albumArt.classList.remove('playing');
}

playBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
});

/* --- Next / Prev --- */
function nextSong() {
  if (isShuffle) {
    songIndex = Math.floor(Math.random() * songs.length);
  } else {
    songIndex = (songIndex + 1) % songs.length;
  }
  loadSong(songIndex);
  if (isPlaying) playAudio();
}

function prevSong() {
  if (isShuffle) {
    songIndex = Math.floor(Math.random() * songs.length);
  } else {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
  }
  loadSong(songIndex);
  if (isPlaying) playAudio();
}

nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

/* --- Shuffle & Repeat --- */
shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('active', isShuffle);
});

repeatBtn.addEventListener('click', () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle('active', isRepeat);
});

// When a song ends
audio.addEventListener('ended', () => {
  if (isRepeat) {
    playAudio(); // Replay same song
  } else {
    nextSong();
  }
});

/* --- Progress Bar Update --- */
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

audio.addEventListener('timeupdate', (e) => {
  const { currentTime, duration } = e.target;
  if (duration) {
    const percent = (currentTime / duration) * 100;
    progressFill.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
    totalTimeEl.textContent = formatTime(duration);
  }
});

/* --- Click to Seek --- */
progressBarWrapper.addEventListener('click', (e) => {
  const width = progressBarWrapper.clientWidth;
  // Use getBoundingClientRect for accurate offset even if there's padding
  const rect = progressBarWrapper.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const duration = audio.duration;
  if (duration) {
    audio.currentTime = (clickX / width) * duration;
  }
});

/* --- Volume Control --- */
volumeSlider.addEventListener('input', (e) => {
  audio.volume = e.target.value;
  if(audio.volume > 0) {
    volOnIcon.style.opacity = '1';
  } else {
    volOnIcon.style.opacity = '0.5';
  }
});

muteBtn.addEventListener('click', () => {
  if (audio.volume > 0) {
    audio.dataset.prevVolume = audio.volume;
    audio.volume = 0;
    volumeSlider.value = 0;
    volOnIcon.style.opacity = '0.5'; // Dim icon
  } else {
    audio.volume = audio.dataset.prevVolume || 1;
    volumeSlider.value = audio.volume;
    volOnIcon.style.opacity = '1';
  }
});

/* --- Init --- */
renderPlaylist();
loadSong(songIndex);