import "./db";  //function, const를 import 하는게 아님. 파일 자체를 import
import "./models/Video";
import "./models/User";
import app from "./server";

const PORT = 4030;

const handleListening = () =>
    console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
