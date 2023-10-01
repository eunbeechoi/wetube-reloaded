import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    avatarUrl: String,
    socialOnly: {type: Boolean, default: false},
    username: {type: String, required: true, unique: true},
    password: {type: String},
    name: {type: String, required: true},
    location: String,
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
    videos: [{type: mongoose.Schema.Types.ObjectId, ref: "Video"}]  //Video 모델에 연결 

});

//비밀번호 저장
userSchema.pre('save', async function(){   //save하기 전에 async 함수 사용 
    //property가 하나라도 수정되면 isModified true
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 5);    //this는 유저컨트롤러 - postJoin에서 create되는 User를 가르킴 / 이 함수가 비번 hash
    }
    
});

const User = mongoose.model("User", userSchema);
export default User;