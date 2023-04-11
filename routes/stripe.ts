import express, { Router } from "express";
import Stripe from "stripe";

import dotenv from "dotenv";
dotenv.config();
const router: Router = express.Router();

const STRIPE_PAS: string | undefined = process.env.STRIPE_PAS;
if (!STRIPE_PAS) {
    throw new Error("Missing PASS_SEC environment variable");
}

const stripe = new Stripe(STRIPE_PAS, {
    apiVersion: "2022-11-15",
});

router.post("/payment", (req: any, res: any) => {
    try {
        const { tokenId, amount } = req.body;
        const charges = stripe.charges.create({
            source: tokenId,
            amount: amount,
            currency: "gbp",
        });
        res.status(200).json(charges);
    } catch (err) {
        res.status(500).json(err);
    }
});

export { router };
