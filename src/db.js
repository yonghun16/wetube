import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const handleOpen = () => console.log("✅ DB Connected");
const handleError = (error) => console.log("❌ DB Connection Error", error);

db.on("error", handleError);
db.once("open", handleOpen);


