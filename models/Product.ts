import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
    title: string;
    desc: string;
    img: string;
    categories?: string[]; // maybe remove ? if error
    size?: string;
    color?: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        desc: { type: String, required: true },
        img: { type: String, required: true },
        categories: { type: Array },
        size: { type: String },
        color: { type: String },
        price: { type: Number, required: true },
    },
    { timestamps: true }
);

//const productModel = mongoose.model("Product, ProductSchema"); // this has been refactored, can delete

const ProductModel: Model<IProduct> = mongoose.model<IProduct>(
    "Product",
    ProductSchema
); //maybe with string???

export default ProductModel;
