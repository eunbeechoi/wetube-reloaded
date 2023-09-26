import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";


const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview")

const handleDownload = async() => {
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load(); //ffmpeg.load()를 await하는 이유: 사용자가 소프트웨어를 사용할 것이기 떄문

    // ffmpeg에 파일 만들기 
    ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile))

    await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4")  //mp4로 변환  //"-r", "60" 초당 60프레임으로 인코딩 -> 더 빠른 영상 인코딩 가능 

    const a = document.createElement("a");
    a.href = videoFile; // 이 링크는 videoFile로 갈 수 있는 url과 연결 
    a.download = "MyRecording.webm"; // a태그에 download 속성 추가
    a.click();

};

const handleStop = () => {
    startBtn.innerText = "Download Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);

    recorder.stop();
};

//function은 외부에 있는 variable을 받을 수 있음
let stream;
let recorder;
let videoFile;

const handleStart = () => {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStart)
    startBtn.addEventListener("click", handleStop)
    recorder = new MediaRecorder(stream);
    //녹화가 멈추면 발생하는 event
    recorder.ondataavailable =(event) => {
        //createObjectURL - 브라우저 메모리에서만 가능한 URL 만듦
        //파일을 가리키는 URL 
        videoFile = URL.createObjectURL(event.data)
        console.log(videoFile);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    };
    recorder.start();
};

const init = async() => {
    //getUserMedia 함수 호출, getUserMedia는 mediaDevices라는 object의 function
    //getUserMedia - 마이크, 카메라 같은 미디어 장비에 접근 
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {width: 200, height: 100},
    });
    //video에 stream을 넣어줌
    video.srcObject = stream;
    video.play();
};

init();

startBtn.addEventListener("click", handleStart)