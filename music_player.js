const songs = [
  { title: "Song One", artist: "Artist A", src: "song1.mp3" },
  { title: "Song Two", artist: "Artist B", src: "song2.mp3" },
  { title: "Song Three", artist: "Artist C", src: "song3.mp3" }
];

let currentSongIndex = 0;

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");
const playlistEl = document.getElementById("playlist");

function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.src;
}

function playSong() {
  audio.play();
  playBtn.textContent = "⏸";
}

function pauseSong() {
  audio.pause();
  playBtn.textContent = "▶";
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
  highlightPlaylist();
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
  highlightPlaylist();
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const percent = (currentTime / duration) * 100;
  progress.style.width = percent + "%";

  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
}

function formatTime(time) {
  let minutes = Math.floor(time / 60) || 0;
  let seconds = Math.floor(time % 60) || 0;
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

function setVolume() {
  audio.volume = volumeSlider.value;
}

function buildPlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.title + " - " + song.artist;
    li.addEventListener("click", () => {
      currentSongIndex = index;
      loadSong(songs[currentSongIndex]);
      playSong();
      highlightPlaylist();
    });
    playlistEl.appendChild(li);
  });
  highlightPlaylist();
}

function highlightPlaylist() {
  [...playlistEl.children].forEach((li, index) => {
    li.classList.toggle("active", index === currentSongIndex);
  });
}

playBtn.addEventListener("click", () => {
  const isPlaying = !audio.paused;
  isPlaying ? pauseSong() : playSong();
});

prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
audio.addEventListener("timeupdate", updateProgress);
progressContainer.addEventListener("click", setProgress);
volumeSlider.addEventListener("input", setVolume);
audio.addEventListener("ended", nextSong);

// Initialize
loadSong(songs[currentSongIndex]);
buildPlaylist();
setVolume();
