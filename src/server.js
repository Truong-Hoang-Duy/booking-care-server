import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRouter from "./routes/web";
import connectDB from "./config/connectDB";
import cors from "cors";
require("dotenv").config();

const app = express();

app.use(cors({ origin: true }));

// limit use upload file
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

viewEngine(app);
initWebRouter(app);

connectDB();

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("http://localhost:3001");
});
