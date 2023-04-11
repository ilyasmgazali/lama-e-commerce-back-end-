import {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndAuthorization,
} from "./verifyToken";
import express, { Router } from "express";
import { Request, Response } from "express";
import userModel, { IUser } from "../models/User";
import dotenv from "dotenv";
dotenv.config();

const router: Router = express.Router();

const PASS_SEC: string | undefined = process.env.PASS_SEC;
if (!PASS_SEC) {
    throw new Error("Missing PASS_SEC environment variable");
}

// UPDATE + VERIFY ADMIN PRIVILEGE //USER CAN UPDAT HIS OWN?????????
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    console.log("USERS WITH INPUT WORKS"); ///////

    //VEIFY USER OR ADMIN, MOVED TO verifyToken.ts // DELETE THIS LINE

    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            PASS_SEC
        ).toString();
    }
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true } // return updated user
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

// -------- convert to typescript -----------
// -------- convert to typescript -----------
// ---------      DELETE        -------------
// -------- convert to typescript -----------
// -------- convert to typescript -----------
// -------- convert to typescript -----------
// -------- convert to typescript -----------
// -------- convert to typescript -----------
// -------- convert to typescript -----------
// -------- convert to typescript -----------
// -------- convert to typescript -----------
router.delete(
    "/:id",
    verifyTokenAndAuthorization,
    async (req: any, res: any) => {
        try {
            // process id/ request param
            const userdID: "string" = req.params.id; // typecheck this

            // find user
            const findUser: IUser | null = await userModel.findByIdAndDelete(
                userdID
            );

            res.status(200).json({
                message: "Successfuly deleted user",
                findUser,
            }); //error.message;
        } catch (error) {
            res.status(500).json(error);
        }
    }
);

// GET USER (only ADMIN)  CONVERT TO TYPESCRIPT
router.get("/find/:id", verifyTokenAndAdmin, async (req: any, res: any) => {
    try {
        // process id/ request param
        const userdID: "string" = req.params.id; // typecheck this

        const findUser: IUser | null = await userModel.findById(userdID);

        if (!findUser) {
            console.log("unable to find user");
            return res.status(401).json("User not found");
        }

        const { password = "", ...others } =
            findUser != null ? findUser.toObject() : {}; // password default is empty, but this will never run if not null, can create better typescript code to update, if I ever decide to take the if statement out above

        //if (findUser != null) {
        //    const { password: string, ...others } = findUser.toObject(); //instead of ._doc
        //}

        res.status(200).json({
            message: "Successfuly returned user",
            others,
        }); //error.message;
    } catch (error) {
        res.status(500).json({ message: "error", error });
    }
});

// // // GET ALL USERS  CONVERT TO TYPESCRIPT
router.get("/", verifyTokenAndAdmin, async (req: any, res: any) => {
    const query = req.query.new;

    try {
        // process id/ request param
        const userdID: "string" = req.query.new; // typecheck this

        const findAllUsers: IUser[] | null = query
            ? await userModel.find().sort({ _id: -1 }).limit(5)
            : await userModel.find();

        if (!findAllUsers) {
            return res.status(401).json("There are no users in the system");
        }

        const usersWithoutExposedPassword: object[] = findAllUsers.map(
            (user: IUser) => {
                const { password = "", ...others } = user.toObject();
                return others;
            }
        );

        // delete
        // const { password = "", ...others } =
        //     findAllUsers != null ? findAllUsers.toObject() : {}; // password default is empty, but this will never run if not null, can create better typescript code to update, if I ever decide to take the if statement out above

        // if (findAllUsers != null) {
        //     const { password: string, ...others } = findAllUsers.toObject(); //instead of ._doc
        // }

        res.status(200).json({
            message: "Successfuly returned user",
            usersWithoutExposedPassword,
        }); //error.message;
    } catch (error) {
        res.status(500).json(error);
    }
});

// // // GET USER STATS
// // router.get("/stats", verifyTokenAndAdmin, UserController.getUserStats);

export { router };
