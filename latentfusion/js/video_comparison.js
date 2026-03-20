// Laura Fink, 2024
// based on the code by Dor Verbin, which based on
// http://thenewcode.com/364/Interactive-Before-and-After-Video-Comparison-in-HTML5-Canvas
// https://jsfiddle.net/7sk5k4gp/13/
// additional features: 
// * somewhat responsive size decoupled from the video resolution
// * video will only play during hovering
Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};

function playVids(videoId) {
    var videoMerge = document.getElementById(videoId + "Merge");
    var vid = document.getElementById(videoId);
    var position = 0.5;
    var dragging = false;
    var playing = false;
    var frame_counter = 0;
    var mergeContext = videoMerge.getContext("2d");

    console.log('Initializing playVids for:', videoId);
    if (!vid || !videoMerge) {
        console.error('Video or canvas not found:', videoId);
        return;
    }

    function updateCanvasSize() {
        var container = videoMerge.parentElement;
        var containerWidth = container.clientWidth;
        var aspectRatio = 2*vid.videoHeight / vid.videoWidth;
        videoMerge.width = containerWidth;
        videoMerge.height = containerWidth * aspectRatio;
        console.log('Canvas size updated:', videoMerge.width, videoMerge.height);
    }

    function trackLocation(e) {
        if (!dragging) return;
        var bcr = videoMerge.getBoundingClientRect();
        position = ((e.pageX - bcr.x) / bcr.width).clamp(0, 1);
        console.log('Slider position updated:', position);
    }

    function playOnHover(e) {
        if (!playing) vid.play();
        playing = true;
        console.log('playing');
    }
    function pauseOnLeave(e) {
        if (playing) vid.pause();
        playing = false;
        console.log('pause');
    }

    function trackLocationTouch(e) {
        if (!dragging) return;
        var bcr = videoMerge.getBoundingClientRect();
        position = ((e.touches[0].pageX - bcr.x) / bcr.width).clamp(0, 1);
        console.log('Touch slider position updated:', position);
    }

    function startDragging() {
        dragging = true;
        console.log('Dragging started');
    }

    function stopDragging() {
        dragging = false;
        console.log('Dragging stopped');
    }
    function drawLoop() {
        // return;
        var vidWidth = vid.videoWidth;
        var vidHeight = vid.videoHeight;
        var halfVidWidth = vidWidth / 2;  // Half width of the video
    
        var canvasWidth = videoMerge.width;  // Full width of the canvas
        var canvasHeight = videoMerge.height;  // Full height of the canvas
    
        // if (frame_counter == 5) vid.pause();
        // frame_counter++;

        mergeContext.clearRect(0, 0, canvasWidth, canvasHeight);  // Clear the canvas
    
        // Calculate the width for each side based on the current slider position
        var leftSideWidth = canvasWidth * position;
        var rightSideWidth = canvasWidth - leftSideWidth;

        // Calculate the source width for the left half based on the slider position
        var leftSourceWidth = halfVidWidth * position;

        // Draw the left side of the video on the canvas
        // if(playing)
        mergeContext.drawImage(
            vid,
            0, 0, leftSourceWidth, vidHeight,  // Source: part of the left half of the video based on slider
            0, 0, leftSideWidth, canvasHeight  // Destination: left side of the canvas, scaled by position
        );

        // Calculate the source width for the right half based on the slider position
        var rightSourceWidth = halfVidWidth * (1 - position);

        // Draw the right side of the video on the canvas
        // if(playing)
        mergeContext.drawImage(
            vid,
            halfVidWidth + (halfVidWidth * position), 0, rightSourceWidth, vidHeight,  // Source: part of the right half of the video based on slider
            leftSideWidth, 0, rightSideWidth, canvasHeight  // Destination: right side of the canvas, scaled by remaining width
        );
        

        requestAnimationFrame(drawLoop);  // Continue loop
    
        // Draw the draggable slider line
        mergeContext.beginPath();
        mergeContext.moveTo(canvasWidth * position, 0);
        mergeContext.lineTo(canvasWidth * position, canvasHeight);
        mergeContext.strokeStyle = "#AAAAAA";
        mergeContext.lineWidth = 5;
        mergeContext.stroke();
    
        // Draw draggable elements (arrows, circle)
        var arrowLength = 0.05 * vidHeight;
        var arrowheadWidth = 0.02 * vidHeight;
        var arrowheadLength = 0.03 * vidHeight;
        var arrowPosY = canvasHeight / 10;
        var arrowWidth = 0.007 * vidHeight;
        var currX = canvasWidth * position;
    
        mergeContext.beginPath();
        mergeContext.arc(currX, arrowPosY, arrowLength * 0.7, 0, Math.PI * 2, false);
        mergeContext.fillStyle = "#FFD79340";
        mergeContext.fill();
    
        mergeContext.beginPath();
        mergeContext.moveTo(currX, arrowPosY - arrowWidth / 2);
        mergeContext.lineTo(currX + arrowLength / 2 - arrowheadLength / 2, arrowPosY - arrowWidth / 2);
        mergeContext.lineTo(currX + arrowLength / 2 - arrowheadLength / 2, arrowPosY - arrowheadWidth / 2);
        mergeContext.lineTo(currX + arrowLength / 2, arrowPosY);
        mergeContext.lineTo(currX + arrowLength / 2 - arrowheadLength / 2, arrowPosY + arrowheadWidth / 2);
        mergeContext.lineTo(currX + arrowLength / 2 - arrowheadLength / 2, arrowPosY + arrowWidth / 2);
        mergeContext.lineTo(currX - arrowLength / 2 + arrowheadLength / 2, arrowPosY + arrowWidth / 2);
        mergeContext.lineTo(currX - arrowLength / 2 + arrowheadLength / 2, arrowPosY + arrowheadWidth / 2);
        mergeContext.lineTo(currX - arrowLength / 2, arrowPosY);
        mergeContext.lineTo(currX - arrowLength / 2 + arrowheadLength / 2, arrowPosY - arrowheadWidth / 2);
        mergeContext.lineTo(currX - arrowLength / 2 + arrowheadLength / 2, arrowPosY);
        mergeContext.lineTo(currX - arrowLength / 2 + arrowheadLength / 2, arrowPosY - arrowWidth / 2);
        mergeContext.lineTo(currX, arrowPosY - arrowWidth / 2);
        mergeContext.closePath();
        mergeContext.fillStyle = "#AAAAAA";
        mergeContext.fill();

        
    
    }
    
    
    

    // while (vid.readyState < 3) {
    //     console.log('wait');
    //     console.log('Video not ready yet, waiting for metadata');
    // }
    console.log('Video ready, starting playVids');
    updateCanvasSize();
    vid.play();
    vid.currentTime = 14; // prevent black image
    window.addEventListener("resize", updateCanvasSize);
    videoMerge.addEventListener("mousedown", startDragging, false);
    videoMerge.addEventListener("mouseup", stopDragging, false);
    videoMerge.addEventListener("mouseleave", stopDragging, false);
    videoMerge.addEventListener("mousemove", trackLocation, false);
    videoMerge.addEventListener("mouseover", playOnHover, false);
    videoMerge.addEventListener("mouseleave", pauseOnLeave, false);

    videoMerge.addEventListener("visible", pauseOnLeave, false);


    videoMerge.addEventListener("touchstart", function (e) { startDragging(); trackLocationTouch(e); }, false);
    videoMerge.addEventListener("touchend", stopDragging, false);
    videoMerge.addEventListener("touchmove", trackLocationTouch, false);

    requestAnimationFrame(drawLoop);
    vid.pause();
     
}

function resizeAndPlay(element) {
    var cv = document.getElementById(element.id + "Merge");
    console.log('resizeandplay');

    function updateCanvasSize() {
        var container = cv.parentElement;
        var containerWidth = container.clientWidth;
        var aspectRatio = 2*element.videoHeight / element.videoWidth ;
        cv.width = containerWidth;  // Width is container's width
        cv.height = containerWidth * aspectRatio;  // Height based on aspect ratio of half the video
        console.log('Updated canvas size:', cv.width, cv.height);
    }

    
    // Directly use event listener instead of onloadedmetadata property assignment
    // element.addEventListener('loadedmetadata', function() {
        console.log('Video metadata loaded for:', element.id);
        updateCanvasSize();
        element.play();
        element.style.height = "0px"; // Hide video without stopping it
        playVids(element.id);
    // });


    window.addEventListener("resize", updateCanvasSize); // Adjust canvas size on window resize
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', function() {
    var videoElements = document.querySelectorAll('video');
    videoElements.forEach(function(video) {
        if (document.getElementById(video.id+"Merge") != null) {
        video.addEventListener('loadedmetadata', function() {
            resizeAndPlay(video);
            console.log(video.id)
        });
        
    }
    });
});