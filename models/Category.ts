import { Schema, Document } from 'mongoose';
import db from '../config/db';

export interface ICategory extends Document {
    name: string,
    productNumber: number
}

export function toCategoryDTO(category: ICategory) {
    return {
        id: category._id,
        name: category.name,
        productNumber: Math.ceil(category.productNumber / 18)
    };
}

const CategorytSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    productNumber: { type: Number, required: true }
});

export default db.model<ICategory>('Category', CategorytSchema);
