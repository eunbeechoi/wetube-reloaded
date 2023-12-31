import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {
  // useCreateIndex: true,
  useNewUrlParser: true
});

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error", error);
db.on("error", handleError); //db에서 에러나면 이 이벤트 발생 (error가 날 때마다)
db.once("open", handleOpen); //connection이 열릴 때 이벤트가 한 번 발생
