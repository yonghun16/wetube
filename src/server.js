import express from "express"
import morgan from "morgan"
import flash from "express-flash"
import session from "express-session"
import MongoStore from "connect-mongo"
import rootRouter from "./routers/rootRouter"
import userRouter from "./routers/userRouter"
import videoRouter from "./routers/videoRouter"
import apiRouter from "./routers/apiRouter"
import { localsMiddleware } from "./middlewares"


const app = express()
const logger = morgan("dev")                // morgan -> node.js 용 request logger middleware

app.set("view engine", "pug")
app.set("views", process.cwd() + "/src/views")

app.use(logger)
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// session 미들웨어
// app.use(session())를 사용하면, Express의 req 객체에 session 속성이 추가됨. 이를 통해 요청(request) 간에 데이터를 유지 가능
app.use(session({
  secret: process.env.COOKIE_SECRET,        // session을 암호화 할 때 쓰는 key (무작위의 긴 문자열 사용) 
  resave: false,                            // 변경되지 않은 세션은 저장할 것인가?(로그인 성공 시 세션은 초기화 되면서 수정됨.)
  saveUninitialized: false,                 // 초기화되지 않은 session에 대해서도 저장할 것인가?(로그인 성공시 세션은 초기화됨)
  // MongoStore를 통해 DB에 session을 저장
  store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
}))

app.use(flash());
app.use(localsMiddleware)  // local 미들웨어
app.use("/uploads", express.static("uploads")) // uploads 폴더에 있는 파일을 클라이언트가 직접 접근할 수 있도록 함.
app.use("/static", express.static("assets"))
app.use("/", rootRouter)
app.use("/videos", videoRouter)
app.use("/users", userRouter)
app.use("/api", apiRouter)

export default app
