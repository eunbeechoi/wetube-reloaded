
import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";




const app = express();  // express function을 사용하면 express application 을 생성해줘.
// express application이 만들어진 다음부터 코드를 작성해야 함.
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//이 미들웨어를 router 앞에 초기화 해주면 됨. 
// 세션 미들웨어가 사이트로 들어오는 모두를 기억함. 
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.DB_URL}),
    })
);


app.use(flash());   // flash 미들웨어는 messages라는 locals를 사용할 수 있게 해줌 
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);

app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
  });


app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);


    
export default app;



