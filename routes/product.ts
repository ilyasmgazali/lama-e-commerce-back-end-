import {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndAuthorization,
} from "./verifyToken";
import express, { Router } from "express";
import { Request, Response } from "express";
import ProductModel, { IProduct } from "../models/Product";
import dotenv from "dotenv";
//import ProductModel from "../models/User";
dotenv.config();

const router: Router = express.Router();

const PASS_SEC: string | undefined = process.env.PASS_SEC;
if (!PASS_SEC) {
    throw new Error("Missing PASS_SEC environment variable");
}

// CREATE
// refactor to typescript
router.post("/", verifyTokenAndAdmin, async (req: any, res: any) => {
    const newProduct: IProduct | null = new ProductModel(req.body);
    try {
        //can maybe check if the correct type is created, and that body is not null
        const savedProduct: IProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

// // UPDATE + VERIFY ADMIN PRIVILEGE //USER CAN UPDAT HIS OWN?????????
// CONVERT TO TYPESRIPT
router.put("/:id", verifyTokenAndAdmin, async (req: any, res: any) => {
    try {
        const updateProduct: IProduct | null =
            await ProductModel.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true } // return updated user
            );
        res.status(200).json(updateProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

// // -------- convert to typescript -----------
// // -------- convert to typescript -----------
// // ---------      DELETE        -------------
// // -------- convert to typescript -----------
// // -------- convert to typescript -----------
// // -------- convert to typescript -----------
// // -------- convert to typescript -----------
// // -------- convert to typescript -----------
// // -------- convert to typescript -----------
// // -------- convert to typescript -----------
// // -------- convert to typescript -----------
router.delete("/:id", verifyTokenAndAdmin, async (req: any, res: any) => {
    try {
        // process id/ request param
        const userdID: "string" = req.params.id; // typecheck this

        // find user
        const findUser: IProduct | null = await ProductModel.findByIdAndDelete(
            userdID
        );

        // refactor
        // remove password, if you want to return user!

        res.status(200).json({
            message: "Successfuly deleted user",
            findUser,
        }); //error.message;
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET PRODUCT  CONVERT TO TYPESCRIPT
router.get("/find/:id", async (req: any, res: any) => {
    try {
        // process id/ request param
        const userdID: "string" = req.params.id; // typecheck this

        const findUser: IProduct | null = await ProductModel.findById(userdID);

        if (!findUser) {
            console.log("unable to find user");
            return res.status(401).json("User not found");
        }

        const { password = "", ...others } =
            findUser != null ? findUser.toObject() : {}; // password default is empty, but this will never run if not null, can create better typescript code to update, if I ever decide to take the if statement out above

        //if (findUser != null) {
        //    const { password: string, ...others } = findUser.toObject(); //instead of ._doc
        //}

        res.status(200).json(others); //error.message;
    } catch (err) {
        res.status(500).json({ message: "error", err });
    }
});

// GET ALL PRODUCTS -   CONVERT TO TYPESCRIPT
router.get("/", async (req: any, res: any) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
        // process id/ request param
        // const userdID: "string" = req.query.new; // typecheck this

        let findProducts: any;

        if (qNew) {
            findProducts = await ProductModel.find()
                .sort({ createdAt: -1 })
                .limit(1);
        } else if (qCategory) {
            findProducts = await ProductModel.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            findProducts = await ProductModel.find();
        }

        if (!findProducts) {
            // const findAllUsers: IProduct[] | null = qNew
            //     ? await ProductModel.find().sort({ _id: -1 }).limit(5)
            //     : await ProductModel.find();

            return res.status(401).json("There are no users in the system");
        }

        res.status(200).json(findProducts); //error.message;
    } catch (err) {
        res.status(500).json(err);
    }
});

export { router };
