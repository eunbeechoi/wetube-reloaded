import express from "express";
import {getEdit, postEdit, logout, see, startGithubLogin, finishGithubLogin, getChangePassword, postChangePassword } from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware, avatarUpload} from "../middlewares";

const userRouter = express.Router();


userRouter.get("/logout", protectorMiddleware, logout);

//single-> 하나의 파일만 업로드, ("avatar")-> input name을 middleware에 전달  
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"), postEdit); //middleware(uploadfiles)실행한 다음, postEdit 실행 
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish",publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", see);


export default userRouter;