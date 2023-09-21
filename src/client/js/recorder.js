const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview")


const handleStop = () => {
    startBtn.innerText = "Start Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleStart);
};

//function은 외부에 있는 variable을 받을 수 있음
let stream;

const handleStart = () => {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStart)
    startBtn.addEventListener("click", handleStop)
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable =(e) => {
        console.log("recording done");
        console.log(e);
        console.log(e.data);
    };
    console.log(recorder);
    recorder.start();
    console.log(recorder);
    setTimeout(() => {
        recorder.stop();
    }, 10000);
};

const init = async() => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {width: 200, height: 100},
    });
    video.srcObject = stream;  //video에 stream을 넣어줌
    video.play();
};

init();

startBtn.addEventListener("click", handleStart)