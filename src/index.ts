import dotenv from "dotenv";
import connectToDB from "./db";
import { app } from "./app";

dotenv.config();

connectToDB()
.then(()=>{
    app.listen(process.env.PORT || 8080);
    console.log(`Server is running on http://localhost:${process.env.PORT||8080}`)
})
.catch((error)=>{
    console.error("MongoDB Connection Error", error);
});