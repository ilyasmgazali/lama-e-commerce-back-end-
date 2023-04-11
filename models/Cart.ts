import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICartItem {
    productId: string;
    quantity: number;
}

export interface ICart extends Document {
    userId: string;
    products: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

const CartSchema: Schema = new mongoose.Schema(
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

//const CartModel = mongoose.model("Cart, CartSchema");
const CartModel: Model<ICart> = mongoose.model<ICart>("Cart", CartSchema);

export default CartModel;
