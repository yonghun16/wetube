import express from "express";
import { logout, edit, remove, startGithubLogin, finishGithubLogin, see } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.get("/logout", logout)
userRouter.get("/edit", edit)
userRouter.get("/remove", remove)
userRouter.get("/github/start", startGithubLogin)
userRouter.get("/github/finish", finishGithubLogin)
userRouter.get(":id", see);

export default userRouter
