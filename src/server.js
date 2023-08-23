import express from "express";

const PORT = 4000;

const app = express();  // express function을 사용하면 express application 을 생성해줘.
// express application이 만들어진 다음부터 코드를 작성해야 함.


const handleHome = (req, res) => {
    return res.send("<h1>I still love you </h1>");
};

const handleLogin = (req, res) => {
    return res.send("Login here.");
};

app.get("/", handleHome);
app.get("/login", handleLogin);

const handleListening = () => 
    console.log(`Server listening on port http://localhost:${PORT} 🚀`);

app.listen(4000, handleListening);

