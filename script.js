/* =========================================================
   MEHFIL — YOUTUBE GHAZAL RADIO
   GitHub Pages Version
========================================================= */

const PLAYLIST_ID = "PLJeNQvgQ4Sl-uomVtOARCoEmMPJUkZH8p";

let player = null;
let playerReady = false;
let isPlaying = false;
let progressTimer = null;


/* =========================================================
   HELPER
========================================================= */

function $(id) {
  return document.getElementById(id);
}


function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(secs).padStart(2, "0")
  );
}


/* =========================================================
   TRACK INFORMATION
========================================================= */

function updateTrackInfo() {

  if (!player || !playerReady) {
    return;
  }

  const videoData = player.getVideoData();

  const title =
    videoData.title ||
    "MEHFIL RADIO";

  const artist =
    videoData.author ||
    "90s Ghazal Collection";


  $("songTitle").textContent = title;
  $("artist").textContent = artist;

  $("mobileTitle").textContent = title;
  $("mobileArtist").textContent = artist;
}


/* =========================================================
   PROGRESS
========================================================= */

function updateProgress() {

  if (!player || !playerReady) {
    return;
  }

  const current =
    player.getCurrentTime() || 0;

  const duration =
    player.getDuration() || 0;


  let percentage = 0;

  if (duration > 0) {
    percentage =
      (current / duration) * 100;
  }

  percentage =
    Math.max(
      0,
      Math.min(
        100,
        percentage
      )
    );


  /* Desktop */

  $("progressFill").style.width =
    percentage + "%";

  $("progressKnob").style.left =
    percentage + "%";


  /* Mobile */

  $("mobileProgressFill").style.width =
    percentage + "%";

  $("mobileProgressKnob").style.left =
    percentage + "%";


  /* Time */

  $("currentTime").textContent =
    formatTime(current);

  $("duration").textContent =
    formatTime(duration);

  $("mobileCurrentTime").textContent =
    formatTime(current);

  $("mobileDuration").textContent =
    formatTime(duration);
}


/* =========================================================
   PLAYING STATE
========================================================= */

function setPlayingState(state) {

  isPlaying = state;


  /* Desktop button */

  $("playButton").textContent =
    state ? "Ⅱ" : "▶";


  /* Mobile button */

  $("mobilePlayButton").textContent =
    state ? "Ⅱ" : "▶";


  $("playButton").setAttribute(
    "aria-label",
    state ? "Pause" : "Play"
  );


  $("mobilePlayButton").setAttribute(
    "aria-label",
    state ? "Pause" : "Play"
  );


  /* Vinyl */

  $("vinyl").classList.toggle(
    "playing",
    state
  );

  $("mobileVinyl").classList.toggle(
    "playing",
    state
  );
}


/* =========================================================
   PROGRESS TIMER
========================================================= */

function startProgressTimer() {

  stopProgressTimer();

  updateProgress();

  progressTimer =
    setInterval(
      updateProgress,
      500
    );
}


function stopProgressTimer() {

  if (progressTimer) {

    clearInterval(
      progressTimer
    );

    progressTimer = null;
  }
}


/* =========================================================
   PLAY / PAUSE
========================================================= */

function togglePlay() {

  if (!playerReady) {

    console.log(
      "YouTube player is not ready yet."
    );

    return;
  }


  if (isPlaying) {

    player.pauseVideo();

  } else {

    player.playVideo();

  }
}


/* =========================================================
   NEXT
========================================================= */

function nextTrack() {

  if (!playerReady) {
    return;
  }

  player.nextVideo();

  setTimeout(
    updateTrackInfo,
    500
  );
}


/* =========================================================
   PREVIOUS
========================================================= */

function previousTrack() {

  if (!playerReady) {
    return;
  }

  player.previousVideo();

  setTimeout(
    updateTrackInfo,
    500
  );
}


/* =========================================================
   SEEK
========================================================= */

function seekTrack(
  event,
  element
) {

  if (!playerReady) {
    return;
  }


  const duration =
    player.getDuration();


  if (!duration) {
    return;
  }


  const rect =
    element.getBoundingClientRect();


  const position =
    (event.clientX - rect.left) /
    rect.width;


  const safePosition =
    Math.max(
      0,
      Math.min(
        1,
        position
      )
    );


  player.seekTo(
    duration * safePosition,
    true
  );


  updateProgress();
}


/* =========================================================
   SEEK BAR SETUP
========================================================= */

function setupSeekBar(id) {

  const element = $(id);

  if (!element) {
    return;
  }


  element.addEventListener(
    "click",
    function(event) {

      seekTrack(
        event,
        element
      );

    }
  );
}


/* =========================================================
   YOUTUBE IFRAME API
========================================================= */

/*
  YouTube automatically calls this function after
  https://www.youtube.com/iframe_api has loaded.
*/

window.onYouTubeIframeAPIReady =
  function() {

    console.log(
      "MEHFIL: YouTube API loaded"
    );


    player =
      new YT.Player(
        "youtube-player",
        {

          /*
            Give YouTube a real player size.
          */

          width: "320",
          height: "180",


          playerVars: {

            /*
              IMPORTANT:
              Load the complete playlist.
            */

            listType: "playlist",

            list: PLAYLIST_ID,


            /*
              Do not autoplay.
              User clicks Play.
            */

            autoplay: 0,


            /*
              YouTube controls remain available
              inside the hidden testing player.
            */

            controls: 1,


            rel: 0,

            playsinline: 1,

            modestbranding: 1

          },


          events: {

            /* =====================================
               PLAYER READY
            ===================================== */

            onReady:
              function() {

                console.log(
                  "MEHFIL: YouTube player ready"
                );


                playerReady = true;


                /*
                  Give YouTube a moment to load
                  the first playlist item.
                */

                setTimeout(
                  function() {

                    updateTrackInfo();

                    updateProgress();

                  },
                  500
                );

              },


            /* =====================================
               PLAYER STATE
            ===================================== */

            onStateChange:
              function(event) {


                /*
                  PLAYING
                */

                if (
                  event.data ===
                  YT.PlayerState.PLAYING
                ) {

                  console.log(
                    "MEHFIL: Playing"
                  );


                  setPlayingState(
                    true
                  );


                  updateTrackInfo();


                  startProgressTimer();

                }


                /*
                  PAUSED
                */

                else if (
                  event.data ===
                  YT.PlayerState.PAUSED
                ) {

                  console.log(
                    "MEHFIL: Paused"
                  );


                  setPlayingState(
                    false
                  );


                  stopProgressTimer();


                  updateProgress();

                }


                /*
                  ENDED
                */

                else if (
                  event.data ===
                  YT.PlayerState.ENDED
                ) {

                  console.log(
                    "MEHFIL: Track ended"
                  );


                  setPlayingState(
                    false
                  );


                  stopProgressTimer();


                  updateProgress();


                  setTimeout(
                    updateTrackInfo,
                    500
                  );

                }


                /*
                  BUFFERING
                */

                else if (
                  event.data ===
                  YT.PlayerState.BUFFERING
                ) {

                  updateTrackInfo();

                }

              },


            /* =====================================
               ERROR
            ===================================== */

            onError:
              function(event) {

                console.log(
                  "MEHFIL YouTube Error:",
                  event.data
                );

                /*
                  YouTube error codes:

                  2  = Invalid parameter
                  5  = HTML5 player error
                  100 = Video removed/private
                  101 = Owner doesn't allow embedding
                  150 = Owner doesn't allow embedding
                */
              }

          }

        }
      );

  };


/* =========================================================
   BUTTON EVENTS
========================================================= */

$("playButton")
  .addEventListener(
    "click",
    togglePlay
  );


$("mobilePlayButton")
  .addEventListener(
    "click",
    togglePlay
  );


$("nextButton")
  .addEventListener(
    "click",
    nextTrack
  );


$("mobileNextButton")
  .addEventListener(
    "click",
    nextTrack
  );


$("prevButton")
  .addEventListener(
    "click",
    previousTrack
  );


$("mobilePrevButton")
  .addEventListener(
    "click",
    previousTrack
  );


/* Seek bars */

setupSeekBar(
  "progress"
);

setupSeekBar(
  "mobileProgress"
);


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

  const now =
    new Date();


  $("clock").textContent =
    now.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }
    );
}


updateClock();


setInterval(
  updateClock,
  1000
);


/* =========================================================
   LISTENER COUNT
========================================================= */

/*
  This is a visual number only.
  It is NOT the real YouTube listener count.
*/

const listenerCount =
  1200 +
  Math.floor(
    Math.random() * 100
  );


$("listeners").textContent =
  listenerCount.toLocaleString();


/* =========================================================
   PAGE LOAD LOG
========================================================= */

console.log(
  "MEHFIL Radio initialized"
);

console.log(
  "Playlist:",
  PLAYLIST_ID
);
