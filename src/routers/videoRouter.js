import express from "express";
import {watch, getEdit, postEdit, getUpload, postUpload} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.route("/upload").get(getUpload).post(postUpload)
videoRouter.get("/:id([0-9a-f]{24})", watch); //digit(숫자)만 받아옴 



export default videoRouter;