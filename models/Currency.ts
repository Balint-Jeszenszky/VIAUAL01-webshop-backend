import { Schema, Document } from 'mongoose';
import db from '../config/db';

export interface ICurrency extends Document {
    name: string,
    charge: number,
    price: number
}

const CurrencytSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    charge: { type: Number, required: true }
});

export default db.model<ICurrency>('Currency', CurrencytSchema);
