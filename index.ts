import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const mongoUrl: string | undefined = process.env.MONGO_URL;

if (!mongoUrl) {
    console.error("MONGO_URL not defined in environment variables");
    process.exit(1);
}

mongoose
    .connect(mongoUrl)
    .then(() => console.log("DBConnection Successful!"))
    .catch((error) => console.log(error));

// Test is successful :)
// app.get("/api/test", () => {
//     console.log("Test is successful");
// });

app.listen(process.env.PORT || 6000, () => {
    console.log("Backend server is running!");
});
