import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrder extends Document {
    userId: string;
    products: { productId: string; quantity: number }[];
    amount: number;
    address: object;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new mongoose.Schema(
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
        amount: { type: Number, required: true },
        address: { type: Object, required: true },
        status: { type: String, default: "pending" },
    },
    { timestamps: true }
);

// const orderModel = mongoose.model("Order, OrderSchema"); delete it tests are okay, refactor
const OrderModel: Model<IOrder> = mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;
