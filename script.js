const PLAYLIST_ID = "PLJeNQvgQ4Sl-uomVtOARCoEmMPJUkZH8p";

let ytPlayer = null;
let playerReady = false;
let playing = false;
let progressTimer = null;

const $ = (id) => document.getElementById(id);

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}

function updateTrackInfo() {
  if (!ytPlayer || !playerReady) return;

  const data = ytPlayer.getVideoData ? ytPlayer.getVideoData() : {};
  const title = data.title || "MEHFIL RADIO";
  const artist = data.author || "90s Ghazal Collection";

  setText("songTitle", title);
  setText("artist", artist);
  setText("mobileTitle", title);
  setText("mobileArtist", artist);
}

function setPlayingState(value) {
  playing = value;

  $("playButton").textContent = value ? "Ⅱ" : "▶";
  $("mobilePlayButton").textContent = value ? "Ⅱ" : "▶";
  $("playButton").setAttribute("aria-label", value ? "Pause" : "Play");
  $("mobilePlayButton").setAttribute("aria-label", value ? "Pause" : "Play");

  $("vinyl").classList.toggle("playing", value);
  $("mobileVinyl").classList.toggle("playing", value);
}

function updateProgress() {
  if (!ytPlayer || !playerReady) return;

  const current = ytPlayer.getCurrentTime ? ytPlayer.getCurrentTime() : 0;
  const duration = ytPlayer.getDuration ? ytPlayer.getDuration() : 0;
  const percent = duration ? Math.max(0, Math.min(100, current / duration * 100)) : 0;

  $("progressFill").style.width = `${percent}%`;
  $("progressKnob").style.left = `${percent}%`;
  $("mobileProgressFill").style.width = `${percent}%`;
  $("mobileProgressKnob").style.left = `${percent}%`;

  setText("currentTime", formatTime(current));
  setText("duration", formatTime(duration));
  setText("mobileCurrentTime", formatTime(current));
  setText("mobileDuration", formatTime(duration));
}

function startProgress() {
  stopProgress();
  updateProgress();
  progressTimer = setInterval(updateProgress, 500);
}

function stopProgress() {
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
}

function togglePlay() {
  if (!playerReady) return;

  if (playing) {
    ytPlayer.pauseVideo();
  } else {
    ytPlayer.playVideo();
  }
}

function nextSong() {
  if (!playerReady) return;
  ytPlayer.nextVideo();
  setTimeout(updateTrackInfo, 350);
}

function previousSong() {
  if (!playerReady) return;
  ytPlayer.previousVideo();
  setTimeout(updateTrackInfo, 350);
}

function seekFromEvent(event, element) {
  if (!playerReady) return;

  const duration = ytPlayer.getDuration();
  if (!duration) return;

  const rect = element.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  ytPlayer.seekTo(duration * ratio, true);
  updateProgress();
}

function setupSeek(id) {
  const element = $(id);
  if (!element) return;

  element.addEventListener("click", (event) => seekFromEvent(event, element));
}

window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player("youtube-player", {
    width: "1",
    height: "1",
    playerVars: {
      listType: "playlist",
      list: PLAYLIST_ID,
      autoplay: 0,
      controls: 0,
      rel: 0,
      playsinline: 1,
      modestbranding: 1
    },
    events: {
      onReady: () => {
        playerReady = true;
        updateTrackInfo();
        updateProgress();
      },

      onStateChange: (event) => {
        if (event.data === YT.PlayerState.PLAYING) {
          setPlayingState(true);
          updateTrackInfo();
          startProgress();
        }

        if (event.data === YT.PlayerState.PAUSED) {
          setPlayingState(false);
          stopProgress();
          updateProgress();
        }

        if (event.data === YT.PlayerState.ENDED) {
          setPlayingState(false);
          stopProgress();
          updateProgress();
          setTimeout(updateTrackInfo, 300);
        }

        if (event.data === YT.PlayerState.BUFFERING) {
          updateTrackInfo();
        }
      }
    }
  });
};

$("playButton").addEventListener("click", togglePlay);
$("mobilePlayButton").addEventListener("click", togglePlay);
$("nextButton").addEventListener("click", nextSong);
$("mobileNextButton").addEventListener("click", nextSong);
$("prevButton").addEventListener("click", previousSong);
$("mobilePrevButton").addEventListener("click", previousSong);

setupSeek("progress");
setupSeek("mobileProgress");

function updateClock() {
  const now = new Date();
  setText("clock", now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }));
}

updateClock();
setInterval(updateClock, 1000);

/* Small visual listener counter. It is not a real-time YouTube listener count. */
const baseListeners = 1248;
const variation = Math.floor(Math.random() * 21) - 10;
setText("listeners", (baseListeners + variation).toLocaleString());
