import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const PORT = 4000;

const app = express();  // express function을 사용하면 express application 을 생성해줘.
// express application이 만들어진 다음부터 코드를 작성해야 함.
const logger = morgan("dev");
app.use(logger);


app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);





const handleListening = () =>
    console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
