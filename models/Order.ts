import { Schema, Document } from 'mongoose';
import db from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

type OrderProduct = {
    productID: string,
    amount: number
};

type MapsAPI = {
    APIKey: string | undefined,
    coords: { lng: number, lat: number }
}

export interface IOrder extends Document {
    date: Date,
    products: OrderProduct[],
    mapsAPI: MapsAPI | undefined
}

export function toOrderDTO(order: IOrder) {
    const mapsAPI = order.mapsAPI;
    if (mapsAPI) {
        mapsAPI.APIKey = process.env.MAPS_API_KEY;
    }
    return {
        id: order._id,
        date: order.date,
        products: order.products,
        mapsApi: mapsAPI
    };
}

const CategorytSchema: Schema = new Schema({
    date: { type: Date, required: true },
    products: { type: Array, required: true },
    mapsAPI: { type: Object }
});

export default db.model<IOrder>('Order', CategorytSchema);
