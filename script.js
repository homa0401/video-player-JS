'use strict';

const container = document.querySelector('.container'),
mainVideo = container.querySelector('video'),
videoTimeLine = container.querySelector('.video-timeline'),
progressBar = container.querySelector('.progress-bar'),
volumeBtn = container.querySelector('.volume i'),
volumeSlider = container.querySelector('.left input'),
currentVidTime = container.querySelector('.current-time'),
videoDuration = container.querySelector('.video-duration'),
skipBackward = container.querySelector('.skip-backward i'),
skipForward = container.querySelector('.skip-forward i'),
playPauseBtn = container.querySelector('.play-pause i'),
speedBtn = container.querySelector('.playback-speed span'),
speedOptions = container.querySelector('.speed-options'),
picInPicBtn = container.querySelector('.pic-in-pic span'),
fullScreenBtn = container.querySelector('.fullscreen i');
let timer;


const hideControls = () => {
    if(mainVideo.paused) return; // if  video is paused return
    timer = setTimeout(() =>{ // remove sho-controls class after 3 seconds
        container.classList.remove('show-controls')
    }, 3000)
};

hideControls();

container.addEventListener('mousemove', ()=> {
    container.classList.add('show-controls');
    clearTimeout(timer); // clear timer 
    hideControls(); // calling hideControls
});

const formatTime = time => {
    // getting seconds, minutes, hours
    let seconds  = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time/ 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds; 
    minutes = minutes < 10 ? `0${minutes}` : minutes; 
    hours = hours < 10 ? `0${hours}` : hours; 

    if(hours == 0) {
        return `${minutes}:${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;
}

mainVideo.addEventListener('timeupdate', (e) => {
    let  {currentTime, duration} = e.target; // getting currentTime & duratin of the video
    let percent = (currentTime / duration) * 100;
    progressBar.style.width= `${percent}%`; // passing percent as progressbar width
    currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener('loadeddata', (e)=> {
    videoDuration.innerText = formatTime(e.target.duration); // passing video duration as videoDuration innerText
});

videoTimeLine.addEventListener('click', e => {
    let timelineWidth = videoTimeLine.clientWidth; // getting videoTimeline width
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // updating video currentTime
});

const draggableProgressbar = (e) => {
    let timelineWidth = videoTimeLine.clientWidth; // getting videoTimeline width
    progressBar.style.width = `${e.offsetX}px`; // passing offsetX value as progressbar width
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // updating video currentTime
    currentVidTime.innerText = formatTime(mainVideo.currentTime); // passing video time as curreentVidTime innerText
};

videoTimeLine.addEventListener('mousedown', ()=> { // calling draggableProgress function on mouse =move event 
    videoTimeLine.addEventListener('mousemove', draggableProgressbar);
});


document.addEventListener('mouseup', ()=> { // removing draggableProgress function on mouse =move event 
    videoTimeLine.removeEventListener('mousemove', draggableProgressbar);
});

videoTimeLine.addEventListener('mousemove', e => {
    const progressTime = videoTimeLine.querySelector('span');
    let offsetX = e.offsetX; // getting mouseX position
    progressTime.style.left = `${offsetX}px`; // passing offsetX value as progressTime left value
    let timelineWidth = videoTimeLine.clientWidth; // getting videoTimeline width
    let percent = (e.offsetX / timelineWidth) * mainVideo.duration; // getting percent
    progressTime.innerText = formatTime(percent); // passing percent as progresTime innerText
})

volumeBtn.addEventListener('click', () => {
    if(!volumeBtn.classList.contains('fa-volume-high')) {
        // if volume icon isn`t volume high icon
        mainVideo.volume = 0.5; // passing 0.5 value as video volume
        volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high');
    } else {
        mainVideo.volume = 0.0; // passing 0.0 value as video volume, so the video mute
        volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark')
    }
        volumeSlider.value = mainVideo.volume; //update slider value according to the video volume
});

volumeSlider.addEventListener('input', e => {
    mainVideo.volume = e.target.value; // passing slider value as video volume
    if(e.target.value == 0) {
        // if slider value is 0, chnage icon to mute icon
        volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark');
    } else {
        volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high');
    }
}); 

speedBtn.addEventListener('click', ()=>{
    speedOptions.classList.toggle('show'); // toggle show class
});

speedOptions.querySelectorAll('li').forEach(option => {
    option.addEventListener('click', () => {
        mainVideo.playbackRate = option.dataset.speed; // passing option dataset value as video playback value
        speedOptions.querySelector('.active').classList.remove('active'); // removing active class
        option.classList.add('active'); // adding active class on the selected option
    })
})

document.addEventListener('click', e => { // hide speed options on document click
    if(e.target.tagName !== 'SPAN' || e.target.className !== 'material-symbols-outlined'){
        speedOptions.classList.remove('show'); 
    }
});

picInPicBtn.addEventListener('click', () => {
    mainVideo.requestPictureInPicture(); // changing video mode to picture in picture
});

fullScreenBtn.addEventListener('click', () => {
    container.classList.toggle('fullscreen'); // toggle fullscreen class
    if(document.fullscreenElement){ // if video is already in fullscreen mode
        fullScreenBtn.classList.replace("fa-compress", "fa-expand");
        return document.exitFullscreen(); // exit fullscreen mode
    }
    fullScreenBtn.classList.replace('fa-expand', 'fa-compress');
    container.requestFullscreen(); // go to fullscreen mode
});

skipBackward.addEventListener('click', () => {
    mainVideo.currentTime -= 5; //subract 5 seconds from the current video time
});

skipForward.addEventListener('click', () => {
    mainVideo.currentTime += 5; // add 5 seconds to the current video time
});

playPauseBtn.addEventListener('click', () => {
    // if video paused, play the video else pause the video
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

mainVideo.addEventListener('play', ()=> { // if video is play, change icon to pause
    playPauseBtn.classList.replace('fa-play', 'fa-pause')
});

mainVideo.addEventListener('pause', ()=> { // if video is pause, change icon to play
    playPauseBtn.classList.replace('fa-pause', 'fa-play')
});