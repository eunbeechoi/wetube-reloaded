
import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";




const app = express();  // express function을 사용하면 express application 을 생성해줘.
// express application이 만들어진 다음부터 코드를 작성해야 함.
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended: true}))


//이 미들웨어를 router 앞에 초기화 해주면 됨. 
// 세션 미들웨어가 사이트로 들어오는 모두를 기억함. 
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.DB_URL}),
    })
);



app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);

app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;



