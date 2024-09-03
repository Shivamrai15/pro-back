import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.route";
import path from "path";

const app = express();

app.use(express.json({
    limit : "16kb",
}));
app.use(express.urlencoded({
    extended : true,
    limit : "16kb"
}));

app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, '../public')))
console.log(path.join(__dirname, '../public'))

app.use("/api/v1/auth", authRouter);

export { app }