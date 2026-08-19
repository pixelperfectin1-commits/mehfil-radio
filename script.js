/* =========================================================
   MEHFIL — YOUTUBE MUSIC PLAYER
   SINGLE VIDEO TEST VERSION

   Video:
   https://www.youtube.com/watch?v=z_DFIkcKJL8
========================================================= */


/* =========================================================
   VIDEO
========================================================= */

const VIDEO_ID = "z_DFIkcKJL8";


/* =========================================================
   GLOBAL STATE
========================================================= */

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


/* =========================================================
   TIME FORMAT
========================================================= */

function formatTime(seconds) {

  if (
    !Number.isFinite(seconds) ||
    seconds < 0
  ) {
    return "00:00";
  }

  const minutes =
    Math.floor(seconds / 60);

  const remainingSeconds =
    Math.floor(seconds % 60);

  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(remainingSeconds).padStart(2, "0")
  );
}


/* =========================================================
   UPDATE TRACK INFORMATION
========================================================= */

function updateTrackInfo() {

  if (
    !player ||
    !playerReady
  ) {
    return;
  }

  try {

    const videoData =
      player.getVideoData();

    const title =
      videoData.title ||
      "MEHFIL RADIO";

    const artist =
      videoData.author ||
      "Ghazal Collection";


    /* Desktop */

    const desktopTitle =
      $("songTitle");

    const desktopArtist =
      $("artist");


    if (desktopTitle) {
      desktopTitle.textContent =
        title;
    }


    if (desktopArtist) {
      desktopArtist.textContent =
        artist;
    }


    /* Mobile */

    const mobileTitle =
      $("mobileTitle");

    const mobileArtist =
      $("mobileArtist");


    if (mobileTitle) {
      mobileTitle.textContent =
        title;
    }


    if (mobileArtist) {
      mobileArtist.textContent =
        artist;
    }

  } catch (error) {

    console.log(
      "MEHFIL: Could not read video information",
      error
    );

  }
}


/* =========================================================
   UPDATE PROGRESS BAR
========================================================= */

function updateProgress() {

  if (
    !player ||
    !playerReady
  ) {
    return;
  }

  try {

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


    /* -----------------------------------------
       DESKTOP
    ----------------------------------------- */

    const progressFill =
      $("progressFill");

    const progressKnob =
      $("progressKnob");


    if (progressFill) {

      progressFill.style.width =
        percentage + "%";

    }


    if (progressKnob) {

      progressKnob.style.left =
        percentage + "%";

    }


    /* -----------------------------------------
       MOBILE
    ----------------------------------------- */

    const mobileProgressFill =
      $("mobileProgressFill");

    const mobileProgressKnob =
      $("mobileProgressKnob");


    if (mobileProgressFill) {

      mobileProgressFill.style.width =
        percentage + "%";

    }


    if (mobileProgressKnob) {

      mobileProgressKnob.style.left =
        percentage + "%";

    }


    /* -----------------------------------------
       TIME
    ----------------------------------------- */

    const currentTime =
      $("currentTime");

    const durationTime =
      $("duration");

    const mobileCurrentTime =
      $("mobileCurrentTime");

    const mobileDuration =
      $("mobileDuration");


    if (currentTime) {

      currentTime.textContent =
        formatTime(current);

    }


    if (durationTime) {

      durationTime.textContent =
        formatTime(duration);

    }


    if (mobileCurrentTime) {

      mobileCurrentTime.textContent =
        formatTime(current);

    }


    if (mobileDuration) {

      mobileDuration.textContent =
        formatTime(duration);

    }

  } catch (error) {

    console.log(
      "MEHFIL: Progress update error",
      error
    );

  }
}


/* =========================================================
   PLAYING STATE
========================================================= */

function setPlayingState(state) {

  isPlaying = state;


  /* -----------------------------------------
     DESKTOP PLAY BUTTON
  ----------------------------------------- */

  const playButton =
    $("playButton");


  if (playButton) {

    playButton.textContent =
      state ? "Ⅱ" : "▶";

    playButton.setAttribute(
      "aria-label",
      state ? "Pause" : "Play"
    );

  }


  /* -----------------------------------------
     MOBILE PLAY BUTTON
  ----------------------------------------- */

  const mobilePlayButton =
    $("mobilePlayButton");


  if (mobilePlayButton) {

    mobilePlayButton.textContent =
      state ? "Ⅱ" : "▶";

    mobilePlayButton.setAttribute(
      "aria-label",
      state ? "Pause" : "Play"
    );

  }


  /* -----------------------------------------
     DESKTOP VINYL
  ----------------------------------------- */

  const vinyl =
    $("vinyl");


  if (vinyl) {

    vinyl.classList.toggle(
      "playing",
      state
    );

  }


  /* -----------------------------------------
     MOBILE VINYL
  ----------------------------------------- */

  const mobileVinyl =
    $("mobileVinyl");


  if (mobileVinyl) {

    mobileVinyl.classList.toggle(
      "playing",
      state
    );

  }

}


/* =========================================================
   START PROGRESS TIMER
========================================================= */

function startProgressTimer() {

  stopProgressTimer();

  updateProgress();


  progressTimer =
    setInterval(
      function () {

        updateProgress();

      },
      500
    );

}


/* =========================================================
   STOP PROGRESS TIMER
========================================================= */

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

  console.log(
    "MEHFIL: Play button clicked"
  );


  if (!playerReady) {

    console.log(
      "MEHFIL: YouTube player is not ready"
    );

    return;

  }


  try {

    if (isPlaying) {

      console.log(
        "MEHFIL: Pausing"
      );

      player.pauseVideo();

    } else {

      console.log(
        "MEHFIL: Playing"
      );

      player.playVideo();

    }

  } catch (error) {

    console.error(
      "MEHFIL: Play/Pause error",
      error
    );

  }

}


/* =========================================================
   NEXT BUTTON
========================================================= */

/*
   This is a single-video test.

   There is no playlist yet, so Next does not have
   another video to play.
*/

function nextTrack() {

  console.log(
    "MEHFIL: Next clicked — single video test mode"
  );

}


/* =========================================================
   PREVIOUS BUTTON
========================================================= */

function previousTrack() {

  console.log(
    "MEHFIL: Previous clicked — single video test mode"
  );

}


/* =========================================================
   SEEK FUNCTION
========================================================= */

function seekTrack(
  event,
  element
) {

  if (!playerReady) {

    console.log(
      "MEHFIL: Player not ready for seeking"
    );

    return;

  }


  try {

    const duration =
      player.getDuration();


    if (!duration) {

      return;

    }


    const rect =
      element.getBoundingClientRect();


    const clickPosition =
      event.clientX -
      rect.left;


    let percentage =
      clickPosition /
      rect.width;


    percentage =
      Math.max(
        0,
        Math.min(
          1,
          percentage
        )
      );


    const newTime =
      duration *
      percentage;


    console.log(
      "MEHFIL: Seeking to",
      newTime
    );


    player.seekTo(
      newTime,
      true
    );


    updateProgress();

  } catch (error) {

    console.error(
      "MEHFIL: Seek error",
      error
    );

  }

}


/* =========================================================
   SETUP SEEK BAR
========================================================= */

function setupSeekBar(id) {

  const element =
    $(id);


  if (!element) {

    console.log(
      "MEHFIL: Seek element not found:",
      id
    );

    return;

  }


  element.addEventListener(
    "click",
    function (event) {

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
   IMPORTANT:

   index.html loads:

   script.js

   THEN:

   youtube iframe API

   When YouTube finishes loading,
   it automatically calls:

   window.onYouTubeIframeAPIReady()
========================================================= */

window.onYouTubeIframeAPIReady =
  function () {

    console.log(
      "MEHFIL: YouTube API loaded"
    );


    /* -----------------------------------------
       CREATE PLAYER
    ----------------------------------------- */

    try {

      player =
        new YT.Player(
          "youtube-player",
          {

            /*
              Real iframe size.
            */

            width: "320",

            height: "180",


            /*
              SINGLE VIDEO

              No playlist here.
            */

            videoId:
              VIDEO_ID,


            /*
              YouTube settings
            */

            playerVars: {

              autoplay: 0,

              controls: 1,

              rel: 0,

              playsinline: 1,

              modestbranding: 1,

              iv_load_policy: 3,

              enablejsapi: 1

            },


            /* ---------------------------------
               EVENTS
            --------------------------------- */

            events: {


              /* ================================
                 READY
              ================================= */

              onReady:
                function () {

                  console.log(
                    "MEHFIL: YouTube player ready"
                  );


                  playerReady =
                    true;


                  /*
                    Load information after
                    YouTube has loaded metadata.
                  */

                  setTimeout(
                    function () {

                      updateTrackInfo();

                      updateProgress();

                    },
                    700
                  );

                },


              /* ================================
                 STATE CHANGE
              ================================= */

              onStateChange:
                function (event) {

                  console.log(
                    "MEHFIL: Player state:",
                    event.data
                  );


                  /* -----------------------------
                     PLAYING
                  ----------------------------- */

                  if (
                    event.data ===
                    YT.PlayerState.PLAYING
                  ) {

                    console.log(
                      "MEHFIL: ▶ Playing"
                    );


                    setPlayingState(
                      true
                    );


                    updateTrackInfo();


                    startProgressTimer();

                  }


                  /* -----------------------------
                     PAUSED
                  ----------------------------- */

                  else if (
                    event.data ===
                    YT.PlayerState.PAUSED
                  ) {

                    console.log(
                      "MEHFIL: ⏸ Paused"
                    );


                    setPlayingState(
                      false
                    );


                    stopProgressTimer();


                    updateProgress();

                  }


                  /* -----------------------------
                     ENDED
                  ----------------------------- */

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

                  }


                  /* -----------------------------
                     BUFFERING
                  ----------------------------- */

                  else if (
                    event.data ===
                    YT.PlayerState.BUFFERING
                  ) {

                    console.log(
                      "MEHFIL: Buffering..."
                    );


                    updateTrackInfo();

                  }


                  /* -----------------------------
                     CUED
                  ----------------------------- */

                  else if (
                    event.data ===
                    YT.PlayerState.CUED
                  ) {

                    console.log(
                      "MEHFIL: Video cued"
                    );


                    updateTrackInfo();

                    updateProgress();

                  }

                },


              /* ================================
                 ERROR
              ================================= */

              onError:
                function (event) {

                  console.error(
                    "MEHFIL: YouTube Error:",
                    event.data
                  );


                  /*
                    Error codes:

                    2   Invalid video ID
                    5   HTML5 player error
                    100 Video removed/private
                    101 Embedding not allowed
                    150 Embedding not allowed
                  */


                  if (
                    event.data === 150 ||
                    event.data === 101
                  ) {

                    console.error(
                      "MEHFIL: This YouTube video does not allow embedding."
                    );

                  }


                  if (
                    event.data === 100
                  ) {

                    console.error(
                      "MEHFIL: Video is unavailable or private."
                    );

                  }


                  if (
                    event.data === 2
                  ) {

                    console.error(
                      "MEHFIL: Invalid YouTube video ID."
                    );

                  }

                }

            }

          }
        );


    } catch (error) {

      console.error(
        "MEHFIL: Could not create YouTube player",
        error
      );

    }

  };


/* =========================================================
   BUTTONS
========================================================= */


/* Desktop Play */

const playButton =
  $("playButton");


if (playButton) {

  playButton.addEventListener(
    "click",
    togglePlay
  );

}


/* Mobile Play */

const mobilePlayButton =
  $("mobilePlayButton");


if (mobilePlayButton) {

  mobilePlayButton.addEventListener(
    "click",
    togglePlay
  );

}


/* Desktop Next */

const nextButton =
  $("nextButton");


if (nextButton) {

  nextButton.addEventListener(
    "click",
    nextTrack
  );

}


/* Mobile Next */

const mobileNextButton =
  $("mobileNextButton");


if (mobileNextButton) {

  mobileNextButton.addEventListener(
    "click",
    nextTrack
  );

}


/* Desktop Previous */

const prevButton =
  $("prevButton");


if (prevButton) {

  prevButton.addEventListener(
    "click",
    previousTrack
  );

}


/* Mobile Previous */

const mobilePrevButton =
  $("mobilePrevButton");


if (mobilePrevButton) {

  mobilePrevButton.addEventListener(
    "click",
    previousTrack
  );

}


/* =========================================================
   SEEK BARS
========================================================= */

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

  const clock =
    $("clock");


  if (!clock) {

    return;

  }


  const now =
    new Date();


  clock.textContent =
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
   Visual number only.
   This is NOT YouTube's actual listener count.
*/

const listenerElement =
  $("listeners");


if (listenerElement) {

  const listenerCount =
    1200 +
    Math.floor(
      Math.random() * 100
    );


  listenerElement.textContent =
    listenerCount.toLocaleString();

}


/* =========================================================
   INITIAL LOG
========================================================= */

console.log(
  "===================================="
);

console.log(
  "MEHFIL RADIO INITIALIZED"
);

console.log(
  "Video ID:",
  VIDEO_ID
);

console.log(
  "===================================="
);
