import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
// import { router as userRouter } from "./routes/user";
import { router as authRoute } from "./routes/auth";
import { router as userRoute } from "./routes/user";
import { router as productRoute } from "./routes/product";
import { router as cartRoute } from "./routes/cart";
import { router as orderRoute } from "./routes/order";
import { router as stripeRoute } from "./routes/stripe";
import cors from "cors";

dotenv.config();

const app: Application = express();
const mongoUrl: string | undefined = process.env.MONGO_URL;

if (!mongoUrl) {
    console.error("MONGO_URL not defined in environment variables");
    process.exit(1);
}

mongoose
    .connect(mongoUrl)
    .then(() => console.log("DBConnection Successful!"))
    .catch((err) => console.log(err));

// Test is successful :)
// app.get("/api/test", () => {
//     console.log("Test is successful");
// });

// app.use(express.json()); // for incoming JSON request

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
// app.use("/api/login", authRoute); // DELETE, LOGIN IS WITHIN AUTH
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

app.listen(process.env.PORT || 6000, () => {
    console.log("Backend server is running!");
});
