import {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndAuthorization,
} from "./verifyToken";
import express, { Router } from "express";
import { Request, Response } from "express";
import CartModel, { ICart } from "../models/Cart";
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
router.post("/", verifyToken, async (req: any, res: any) => {
    const newCart: ICart | null = new CartModel(req.body);
    try {
        //can maybe check if the correct type is created, and that body is not null
        const savedCart: ICart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// // // UPDATE + VERIFY ADMIN PRIVILEGE //USER CAN UPDAT HIS OWN?????????
// // CONVERT TO TYPESRIPT
router.put("/:id", verifyTokenAndAuthorization, async (req: any, res: any) => {
    try {
        const updateCart: ICart | null = await CartModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true } // return updated user
        );
        res.status(200).json(updateCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// // // -------- convert to typescript -----------
// // // -------- convert to typescript -----------
// // // ---------      DELETE        -------------
// // // -------- convert to typescript -----------
// // // -------- convert to typescript -----------
// // // -------- convert to typescript -----------
// // // -------- convert to typescript -----------
// // // -------- convert to typescript -----------
// // // -------- convert to typescript -----------
// // // -------- convert to typescript -----------
// // // -------- convert to typescript -----------
router.delete(
    "/:id",
    verifyTokenAndAuthorization,
    async (req: any, res: any) => {
        try {
            const userdID: "string" = req.params.id; // typecheck this

            const findCart: ICart | null = await CartModel.findByIdAndDelete(
                userdID
            );
            res.status(200).json({
                message: "Cart deleted",
                findCart,
            });
        } catch (err) {
            res.status(500).json(err);
        }
    }
);

// GET USER CART  CONVERT TO TYPESCRIPT
router.get(
    "/find/:userId",
    verifyTokenAndAuthorization,
    async (req: any, res: any) => {
        try {
            const userdID: "string" = req.params.id; // typecheck this, when converted to typescript

            const findCart: ICart | null = await CartModel.findOne({
                //array, check if an errors on postman, update accordingly
                userId: userdID,
            });

            if (!findCart) {
                console.log("unable to find user cart");
                return res.status(401).json("User cart not found");
            }

            res.status(200).json({
                message: "Successfuly returned user cart",
                findCart,
            });
        } catch (err) {
            res.status(500).json({ message: "error", err });
        }
    }
);

// GET ALL CART, ADMIN - CONVERT TO TYPESCRIPT
router.get("/", verifyTokenAndAdmin, async (req: any, res: any) => {
    try {
        const allCarts: ICart[] | ICart | null = await CartModel.find(); // maybe ICart is not needed, ICart[] is enough, can test, when there is only a single cart

        if (!allCarts) {
            console.log("There are no carts"); // double check it works when there is no cart, can delete this line after
            return res.status(401).json("There are no carts in the system");
        }

        res.status(200).json({
            message: "Successfuly returned all user cart/s",
            allCarts,
        }); //error.message;
    } catch (err) {
        res.status(500).json(err);
    }
});

export { router };
