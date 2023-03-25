import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRouter from "./router/web";
import connectDB from "./config/connectDB";
import cors from "cors";
require("dotenv").config();

const app = express();

app.use(cors({ origin: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRouter(app);

connectDB();

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("http://localhost:3001");
});
