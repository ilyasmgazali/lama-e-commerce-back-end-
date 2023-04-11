import {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndAuthorization,
} from "./verifyToken";
import express, { Router } from "express";
import { Request, Response } from "express";
import OrderModel, { IOrder } from "../models/Order";
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
    const newOrder: IOrder | null = new OrderModel(req.body);
    try {
        //can maybe check if the correct type is created, and that body is not null
        const savedOrder: IOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

// // // UPDATE + VERIFY ADMIN PRIVILEGE //USER CAN UPDAT HIS OWN?????????
// // CONVERT TO TYPESRIPT
router.put("/:id", verifyTokenAndAdmin, async (req: any, res: any) => {
    try {
        const updateOrder: IOrder | null = await OrderModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true } // return updated user
        );
        res.status(200).json(updateOrder);
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
router.delete("/:id", verifyTokenAndAdmin, async (req: any, res: any) => {
    try {
        const userdID: "string" = req.params.id; // typecheck this

        const findOrder: IOrder | null = await OrderModel.findByIdAndDelete(
            userdID
        );
        res.status(200).json({
            message: "order deleted",
            findOrder,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER ORDER - CONVERT TO TYPESCRIPT
router.get(
    "/find/:userId",
    verifyTokenAndAuthorization,
    async (req: any, res: any) => {
        try {
            const userdID: "string" = req.params.id; // typecheck this, when converted to typescript

            const findOrder: IOrder[] | IOrder | null = await OrderModel.find({
                //array, check if an errors on postman, update accordingly
                userId: userdID,
            });

            if (!findOrder) {
                console.log("unable to find user order"); // test empty ??????
                return res.status(401).json("User order not found");
            }

            res.status(200).json({
                message: "Successfuly returned user order",
                findOrder,
            });
        } catch (err) {
            res.status(500).json({ message: "error", err });
        }
    }
);

// GET ALL ORDERS, ADMIN - CONVERT TO TYPESCRIPT
router.get("/", verifyTokenAndAdmin, async (req: any, res: any) => {
    try {
        const allOrders: IOrder[] | IOrder | null = await OrderModel.find(); // maybe ICart is not needed, ICart[] is enough, can test, when there is only a single cart

        if (!allOrders) {
            console.log("There are no order"); // double check it works when there is no cart, can delete this line after
            return res.status(401).json("There are no order in the system");
        }

        res.status(200).json({
            message: "Successfuly returned all user order/s",
            allOrders,
        }); //error.message;
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ORDER MONTHLY INCOME STATS //CONVERT INTO TYPESCRIPT
router.get("/income", verifyTokenAndAdmin, async (req: any, res: any) => {
    const date: Date = new Date();
    const lastMonth: Date = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth: Date = new Date(
        new Date().setMonth(lastMonth.getMonth() - 1)
    );

    try {
        // only this month and last month
        const income: IOrder[] | null = await OrderModel.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json({ message: "error", err });
    }
});

export { router };
