// === ELEMENTS ===
const fileInput = document.getElementById("fileAdd");
const deleteBtn = document.getElementById("deleteTrackBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const trackList = document.getElementById("trackList");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");

let audio = new Audio();
let tracks = [];
let currentTrack = 0;

// === ADD FILES ===
fileInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  files.forEach((file) => {
    tracks.push({ name: file.name, url: URL.createObjectURL(file) });
  });
  updateTrackList();
});

// === UPDATE PLAYLIST ===
function updateTrackList() {
  trackList.innerHTML = "";
  tracks.forEach((t, i) => {
    const li = document.createElement("li");
    li.textContent = t.name;
    li.addEventListener("click", () => playTrack(i));
    trackList.appendChild(li);
  });
}

// === PLAY SELECTED TRACK ===
function playTrack(index) {
  if (!tracks[index]) return;
  currentTrack = index;
  audio.src = tracks[index].url;
  audio.play();
  playPauseBtn.textContent = "⏸️";
}

// === PLAY/PAUSE BUTTON ===
playPauseBtn.addEventListener("click", () => {
  if (!audio.src && tracks.length > 0) playTrack(0);
  else if (audio.paused) audio.play();
  else audio.pause();
});

audio.addEventListener("play", () => (playPauseBtn.textContent = "⏸️"));
audio.addEventListener("pause", () => (playPauseBtn.textContent = "▶️"));

// === NEXT/PREV TRACKS ===
nextBtn.addEventListener("click", () => {
  if (tracks.length === 0) return;
  currentTrack = (currentTrack + 1) % tracks.length;
  playTrack(currentTrack);
});

prevBtn.addEventListener("click", () => {
  if (tracks.length === 0) return;
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  playTrack(currentTrack);
});

// === PROGRESS BAR ===
audio.addEventListener("timeupdate", () => {
  if (!isNaN(audio.duration)) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});

progress.addEventListener("input", () => {
  if (!isNaN(audio.duration)) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

function formatTime(sec) {
  if (isNaN(sec)) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// === VOLUME ===
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

// === DELETE CURRENT TRACK ===
deleteBtn.addEventListener("click", () => {
  if (tracks.length === 0) return;
  tracks.splice(currentTrack, 1);
  if (currentTrack >= tracks.length) currentTrack = 0;
  updateTrackList();
  if (tracks.length > 0) playTrack(currentTrack);
  else {
    audio.pause();
    audio.src = "";
    playPauseBtn.textContent = "▶️";
  }
});
