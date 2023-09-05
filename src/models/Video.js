import mongoose from "mongoose";

//model을 생성하기 전에 model의 형태 정의 (schema)
const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdAt: Date,
    hashtags: [{ type: String}],
    meta: {
        views: Number,
        rating: Number,
    },
});

//모델을 만들어 준다. 
const Video = mongoose.model("Video", videoSchema);  // mongoose.model("모델 이름", Schema)
export default Video;
