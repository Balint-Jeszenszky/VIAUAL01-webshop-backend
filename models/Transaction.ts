import { Schema, Document } from 'mongoose';
import db from '../config/db';

export interface ITransaction extends Document {
    orderId: string,
    paymentId: string,
    paymentRequestId: string,
    status: string,
    gatewayUrl: string
}

const TransactionSchema: Schema = new Schema({
    orderId: { type: String, required: true, unique: true },
    paymentId: { type: String, required: true },
    paymentRequestId: { type: String, required: true },
    status: { type: String, required: true },
    gatewayUrl: { type: String, required: true }
});

export default db.model<ITransaction>('Transaction', TransactionSchema);
