import express from "express";
import {
  logout,
  postEdit,
  getEdit,
  remove,
  startGithubLogin,
  finishGithubLogin,
  see,
  getChangePassword,
  postChangePassword
} from "../controllers/userController.js";
import { protectorMiddleware, publicOnlyMiddleware, uploadFiles } from "../middlewares.js";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(uploadFiles.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/remove", remove);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get(":id", see);

export default userRouter;
