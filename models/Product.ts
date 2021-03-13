import {Schema, Document} from 'mongoose';
import db from '../config/db';

export interface IProduct extends Document {
    name: string,
    description: string,
    imageURL: string,
    categoryID: Schema.Types.ObjectId,
    price: number,
    stock: number,
    recommended: boolean
}

export function toProductDAO(product: IProduct) {
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
    price: { type: Number, required: true },
    stock: { type: Number },
    recommended: { type: Boolean }
});

export default db.model<IProduct>('Product', ProductSchema);
