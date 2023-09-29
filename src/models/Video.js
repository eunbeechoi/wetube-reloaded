import mongoose from "mongoose";

export const formatHashtags = (hashtags) => 
    hashtags.split(",").map((word) => (word.startsWith("#") ? word :  `#${word}`))

//model을 생성하기 전에 model의 형태 정의 (schema)
const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxLength: 80},
    fileUrl: {type: String, required: true},
    thumbUrl: {type: String, required: true},
    description: { type: String, required: true, trim: true, minLength: 2 },
    createdAt: {type: Date, required: true, default: Date.now},
    hashtags: [{ type: String, trim: true}],
    meta: {
        views: { type: Number, default: 0, required: true },
        rating: { type: Number, default: 0 , required: true},
    },
    comments: [{type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment"}],
    owner: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
});

videoSchema.static('formatHashtags', function(hashtags) {
    return hashtags.split(",").map((word) => (word.startsWith("#") ? word :  `#${word}`))

})


//모델을 만들어 준다. 
const Video = mongoose.model("Video", videoSchema);  // mongoose.model("모델 이름", Schema)
export default Video;
