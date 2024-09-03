import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./routes/auth.route";

dotenv.config();

console.log("Client", process.env.CLIENT);

const app = express();

app.use(cors({
    credentials : true,
    origin : process.env.CLIENT || "http://127.0.0.1:5500"
}));
app.use(express.json({
    limit : "16kb",
}));
app.use(express.urlencoded({
    extended : true,
    limit : "16kb"
}));

app.use(cookieParser());


app.use("/api/v1/auth", authRouter);

export { app }