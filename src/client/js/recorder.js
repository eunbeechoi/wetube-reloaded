import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";


const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview")

const handleDownload = async() => {
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load(); //ffmpeg.load()를 await하는 이유: 사용자가 소프트웨어를 사용할 것이기 떄문

    // ffmpeg에 파일 만들기 
    ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile))

    await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4")  //mp4로 변환  //"-r", "60" 초당 60프레임으로 인코딩 -> 더 빠른 영상 인코딩 가능 

    await ffmpeg.run("-i", "recording.webm", "-ss", "00:00:01", "-frames:v", "1", "thumbnail.jpg") //"-frames:v", "1" -> 첫 프레임(또는 이동한 시간)의 스크린샷을 찍어줌 1은 한장 

    const mp4File = ffmpeg.FS("readFile", "output.mp4");
    const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");

    const mp4Blob = new Blob([mp4File.buffer], {type: "video/mp4"});
    const thumbBlob = new Blob([thumbFile.buffer], {type: "image/jpg"});

    //blob url은 url을 통해서 파일에 접근하는 방법 
    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);


    const a = document.createElement("a");
    a.href = mp4Url;
    a.download = "MyRecording.mp4"; // a태그에 download 속성 추가
    document.body.appendChild(a)
    a.click();

    const thumbA = document.createElement("a");
    thumbA.href = thumbUrl;
    thumbA.download = "MyThumbnail.jpg";
    document.body.appendChild(thumbA)
    thumbA.click();

    ffmpeg.FS("unlink", "recording.webm");
    ffmpeg.FS("unlink", "output.mp4");
    ffmpeg.FS("unlink", "thumbnail.jpg");

    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);
 
    


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