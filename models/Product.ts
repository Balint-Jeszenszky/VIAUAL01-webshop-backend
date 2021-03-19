import {Schema, Document} from 'mongoose';
import db from '../config/db';

type PriceModel = {
    [key: string]: number
}

export interface IProduct extends Document {
    name: string,
    description: string,
    imageURL: string | null,
    categoryID: string,
    price: PriceModel,
    stock: number,
    recommended: boolean
}

export function toProductDTO(product: IProduct) {
    return {
        id: product._id,
        name: product.name,
        description: product.description,
        imageURL: product.imageURL,
        categoryID: product.categoryID,
        price: product.price,
        stock: product.stock
    };
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageURL: { type: String },
    categoryID: { type: Schema.Types.ObjectId },
    price: { type: Object, required: true },
    stock: { type: Number },
    recommended: { type: Boolean }
});

ProductSchema.index({ name: "text", description: "text" });

export default db.model<IProduct>('Product', ProductSchema);
