import { Schema, Document } from 'mongoose';
import db from '../config/db';
import { PushSubscription } from 'web-push';

type Order = {
    id: string,
    date: Date
}

export type ListItem = {
    id: string,
    amount: number
};

export interface IUser extends Document {
    name: string,
    username: string, 
    email: string, 
    address: string | null,
    phoneNumber: string | null,
    password: string,
    orders: Order[],
    cart: ListItem[],
    refreshToken: string | null,
    pushSubscription?: PushSubscription,
    role: 'ADMIN' | 'USER'
}

export function toUserDTO(user: IUser) {
    return {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        address: user.address,
        phoneNumber: user.phoneNumber,
        orders: user.orders,
        role: user.role
    };
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    orders: { type: Array },
    cart: { type: Array },
    refreshToken: { type: String },
    pushSubscription: { type: Object },
    role: { type: String }
});

export default db.model<IUser>('User', UserSchema);
