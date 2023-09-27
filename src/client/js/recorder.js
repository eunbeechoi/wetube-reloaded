import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";


const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview")

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a)
    a.click();
}

const handleDownload = async() => {
    actionBtn.removeEventListener("click", handleDownload);

    actionBtn.innerText = "Transcoding...";
    actionBtn.disabled = true;

    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load(); //ffmpeg.load()를 await하는 이유: 사용자가 소프트웨어를 사용할 것이기 떄문

    // ffmpeg에 파일 만들기 
    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile))

    await ffmpeg.run("-i", files.input, "-r", "60", files.output)  //mp4로 변환  //"-r", "60" 초당 60프레임으로 인코딩 -> 더 빠른 영상 인코딩 가능 

    await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb) //"-frames:v", "1" -> 첫 프레임(또는 이동한 시간)의 스크린샷을 찍어줌 1은 한장 

    const mp4File = ffmpeg.FS("readFile", files.output);
    const thumbFile = ffmpeg.FS("readFile", files.thumb);

    const mp4Blob = new Blob([mp4File.buffer], {type: "video/mp4"});
    const thumbBlob = new Blob([thumbFile.buffer], {type: "image/jpg"});

    //blob url은 url을 통해서 파일에 접근하는 방법 
    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    downloadFile(mp4Url, "MyRecording.mp4")
    downloadFile(thumbUrl, "MyThumbnail.jpg")


    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);

    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);
 
    actionBtn.disabled = false;
    actionBtn.innerText = "Record Again";
    actionBtn.addEventListener("click", handleStart)


};

//function은 외부에 있는 variable을 받을 수 있음
let stream;
let recorder;
let videoFile;

const handleStart = () => {
    actionBtn.innerText = "Recording";
    actionBtn.disabled = true;
    actionBtn.removeEventListener("click", handleStart)
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
        actionBtn.innerText = "Download";
        actionBtn.disabled = false;
        actionBtn.addEventListener("click", handleDownload);
    };
    recorder.start();
    setTimeout(() => {
        recorder.stop();
    }, 5000);
};

const init = async() => {
    //getUserMedia 함수 호출, getUserMedia는 mediaDevices라는 object의 function
    //getUserMedia - 마이크, 카메라 같은 미디어 장비에 접근 
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {width: 1024, height: 576},
    });
    //video에 stream을 넣어줌
    video.srcObject = stream;
    video.play();
};

init();

actionBtn.addEventListener("click", handleStart)