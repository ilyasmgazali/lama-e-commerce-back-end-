import express, { Router } from "express";
import UserModel, { IUser } from "../models/User";
import * as CryptoJS from "crypto-js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

const router: Router = express.Router();
dotenv.config();

// this function/code only runs once when server is created
const PASS_SEC: string | undefined = process.env.PASS_SEC;
if (!PASS_SEC) {
    throw new Error("Missing PASS_SEC environment variable");
}

const JWT_SEC: string | undefined = process.env.JWT_SEC;
if (!JWT_SEC) {
    throw new Error("Missing JWT_SEC environment variable");
}

// REGISTER
router.post("/register", async (req, res) => {
    interface UserInput {
        username: string;
        email: string;
        password: string;
    }
    const { username, email, password }: UserInput = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing user data" });
    }

    const passwordEncrypt = CryptoJS.AES.encrypt(password, PASS_SEC).toString();

    const newUser: IUser = new UserModel({
        username: username,
        email: email,
        password: passwordEncrypt,
    });
    console.log(passwordEncrypt);
    try {
        const checkUserExists = await UserModel.findOne({ username });
        if (checkUserExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const savedUser = await newUser.save();
        console.log(savedUser);
        res.status(201).json({
            message: "Account created successfully",
            savedUser,
        });
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    interface UserInput {
        email: string;
        password: string;
    }
    const { email, password }: UserInput = req.body;

    try {
        const findUser: IUser | null = await UserModel.findOne({
            email: email,
        });
        if (!findUser) {
            return res.status(401).json("Wrong credentials!");
        }

        const hashedPassword = CryptoJS.AES.decrypt(
            findUser.password,
            PASS_SEC
        );
        const originalPasswordUnhashed = hashedPassword.toString(
            CryptoJS.enc.Utf8
        );
        const passwordFromInput = password;
        if (originalPasswordUnhashed !== passwordFromInput) {
            return res.status(401).json("Wrong Password");
        }

        const accessToken = jwt.sign(
            {
                id: findUser._id,
                isAdmin: findUser.isAdmin,
            },
            JWT_SEC,
            { expiresIn: "3d" }
        );

        const { password: string, ...others } = findUser.toObject(); //instead of ._doc

        return res
            .status(200)
            .json({ message: "LoginSuccess ", ...others, accessToken });
    } catch (err) {
        res.status(500).json((err as any).message);
    }
});

export { router };
