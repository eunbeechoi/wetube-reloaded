const video = document.querySelector("video");

const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");


let volumeValue = 0.5;
video.volume= volumeValue;

const handlePlayClick = (e) => {
    //if the video is playing, pause it
    if(video.paused){
        video.play();
    }else {
        video.pause();
    }
    //else play the video
    console.log("play nawara")
    playBtn.innerText = video.paused ? "Play" : "Pause";
};


const handlePause = () => (playBtn.innerText = "Play");
const handlePlay = () => (playBtn.innerText = "Pause");


const handleMute = (e) => {
    if(video.muted) {
        video.muted = false;
    } else{
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmute": "Mute";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
    const {target: {value}} =event;
    if(video.muted){
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = value; //global variable 업데이트 
    video.volume = value;  //비디오 볼륨을 바꾸게 함. 
};

const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(11, 19)

const handleLoadedMetaData = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);

};

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
    const {target: {value}} = event;
   // =  console.log(event.target.value);
   video.currentTime = value;
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);

