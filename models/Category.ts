import { Schema, Document } from 'mongoose';
import db from '../config/db';

export interface ICategory extends Document {
    name: string
}

export function toCategoryDTO(category: ICategory) {
    return {
        id: category._id,
        name: category.name
    };
}

const CategorytSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true }
});

export default db.model<ICategory>('Category', CategorytSchema);
