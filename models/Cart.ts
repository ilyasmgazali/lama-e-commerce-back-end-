import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        products: [
            {
                productId: { type: String },
            },
            {
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
    },
    { timestamps: true }
);

const cartModel = mongoose.model("Cart, CartSchema");
export { cartModel };
