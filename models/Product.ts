import {Schema, Document} from 'mongoose';
import db from '../config/db';
import { ICurrency } from './Currency';

export interface IProduct extends Document {
    name: string,
    description: string,
    imageURL: string | null,
    categoryID: string,
    price: number,
    stock: number,
    recommended: boolean
}

export function toProductDTO(product: IProduct, currencies: ICurrency[]) {
    const price: {[key: string]: number} = {};
    price[process.env.DEFAULT_CURRENCY || ''] = product.price;
    currencies.forEach(c => price[c.name] = product.price * c.price * (1 + c.charge));
    return {
        id: product._id,
        name: product.name,
        description: product.description,
        imageURL: product.imageURL,
        categoryID: product.categoryID,
        price: price,
        stock: product.stock,
        recommended: product.recommended
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

ProductSchema.index({ name: "text", description: "text" });

export default db.model<IProduct>('Product', ProductSchema);
