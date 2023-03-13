var videos = [];

var break_mobile_width = 810;
var break_mobile_height = 790;
const allExceptMobile = window.matchMedia(
    "screen and (min-width: " +
    (break_mobile_width + 1) +
    "px) and (min-height: " +
    (break_mobile_height + 1) +
    "px)"
);
const mobileOnly = window.matchMedia(
    "screen and (orientation: portrait) and (max-width: " +
    break_mobile_width +
    "px)," +
    " screen and (orientation: landscape) and (max-height: " +
    break_mobile_height +
    "px)"
);
const touchableDevicesOnly = window.matchMedia('(hover: none)');
const mobileLandscapeOnly = window.matchMedia(
    "screen and (orientation: landscape) and (max-height:" +
    break_mobile_height +
    "px)"
);
const mobilePortraitOnly = window.matchMedia(
    "screen and (orientation: portrait) and (max-width: " +
    break_mobile_width +
    "px)"
);

const canHover = window.matchMedia('(hover: hover)').matches;

//
// Init (OnDOMLoaded)
//

document.addEventListener("DOMContentLoaded", function () {
    // Fill videos array
    var gallery = document.querySelectorAll(".gallery");
    var videoContainers = document.querySelectorAll(".video-container");
    videoContainers.forEach((container) => {
        videos.push({
            container: gallery[0],
            media: container.querySelector("video"),
            playPromise: null,
            loadingIcon: container.querySelector(".loading"),
            intervalId: null,
        });
    });

    // Add video loading
    videos.forEach((video) => {
        video.media.addEventListener("loadstart", (event) => {
            video.loadingIcon.style.display = "block";
            // console.log("loadstart");
        });
        // video.media.addEventListener("waiting", event => {
        //   video.loadingIcon.style.display = "block";
        //   // console.log("waiting");
        // });
        video.media.addEventListener("canplay", (event) => {
            video.loadingIcon.style.display = "none";
            // console.log("canplay");
        });

        video.media.pause();
    });

    autoplayVideos();
});

// Add scrolling video autoplay
document.addEventListener("scroll", debounce(autoplayVideos, 100), false);

function autoplayVideos() {
    // if (mobileOnly.matches == false) console.log("mobileOnly.matches == false");
    // if (touchableDevicesOnly.matches == false) console.log("touchableDevicesOnly.matches == false");
    if (mobileOnly.matches == false && touchableDevicesOnly.matches == false) return;

    var middle = window.innerHeight / 2;
    // console.log("scroll: ", third, middle);

    var i = 0;
    videos.forEach((video) => {
        // var videoTop = video.media.offsetTop;
        var videoTop = video.media.getBoundingClientRect().top;
        var videoBottom = videoTop + video.media.offsetHeight;
        // console.log("video#" + i + ": " + videoTop + " " + videoBottom);

        if (
            middle > videoTop &&
            middle < videoBottom &&
            video.media.paused
        ) {
            video.playPromise = video.media.play();

            if (video.playPromise) {
                video.playPromise
                    .then((_) => {
                        // Automatic playback started!
                        video.playPromise = null;
                    })
                    .catch((error) => {
                        console.log("Auto-play was prevented");
                    });
            }
        }

        if (
            (middle < videoTop || middle > videoBottom) &&
            video.media.paused == false
        ) {
            if (video.playPromise) {
                video.playPromise
                    .then((_) => {
                        // Automatic playback started!
                        video.playPromise = null;
                        video.media.pause();
                    })
                    .catch((error) => {
                        console.log("Auto-play was prevented");
                    });
            } else {
                video.media.pause();
            }
        }
        i++;
    });
}

// Credit David Walsh (https://davidwalsh.name/javascript-debounce-function)
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;

    // This is the function that is actually executed when
    // the DOM event is triggered.
    return function executedFunction() {
        // Store the context of this and any
        // parameters passed to executedFunction
        var context = this;
        var args = arguments;

        // The function to be called after
        // the debounce time has elapsed
        var later = function () {
            // null timeout to indicate the debounce ended
            timeout = null;

            // Call function now if you did not on the leading end
            if (!immediate) func.apply(context, args);
        };

        // Determine if you should call the function
        // on the leading or trail end
        var callNow = immediate && !timeout;

        // This will reset the waiting every function execution.
        // This is the step that prevents the function from
        // being executed because it will never reach the
        // inside of the previous setTimeout
        clearTimeout(timeout);

        // Restart the debounce waiting period.
        // setTimeout returns a truthy value (it differs in web vs node)
        timeout = setTimeout(later, wait);

        // Call immediately if you're dong a leading
        // end execution
        if (callNow) func.apply(context, args);
    };
}