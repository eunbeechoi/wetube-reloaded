import mongoose from "mongoose";

//model을 생성하기 전에 model의 형태 정의 (schema)
const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxLength: 80},
    description: { type: String, required: true, trim: true, minLength: 20 },
    createdAt: {type: Date, required: true, default: Date.now},
    hashtags: [{ type: String, trim: true}],
    meta: {
        views: { type: Number, default: 0, required: true },
        rating: { type: Number, default: 0 , required: true},
    },
});

videoSchema.pre("save", async function() {
    this.hashtags = this.hashtags[0]
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

//모델을 만들어 준다. 
const Video = mongoose.model("Video", videoSchema);  // mongoose.model("모델 이름", Schema)
export default Video;
