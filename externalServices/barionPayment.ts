/**
 * start a payment with barion
 */

import { IOrder } from '../models/Order';
import { IProduct } from '../models/Product';
import { ITransaction } from '../models/Transaction';
import { Model } from 'mongoose';
import requireOption from '../middleware/generic/requireOption';
import axios from 'axios';
import ObjectRepository from '../models/ObjectRepository';

export default function(objRepo: ObjectRepository) {
    const ProductModel: Model<IProduct> = requireOption(objRepo, 'Product');
    const TransactionModel: Model<ITransaction> = requireOption(objRepo, 'Transaction');
    const baseUrl = process.env.WEBSITE_BASE_URL;
    const POSKey = process.env.BARION_POSKEY;
    const baseCurrency = process.env.DEFAULT_CURRENCY;
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!baseUrl || !POSKey || !baseCurrency || !adminEmail) {
        throw new TypeError('WEBSITE_BASE_URL, BARION_POSKEY, DEFAULT_CURRENCY or ADMIN_EMAIL undefined');
    }

    const startPayment = async (order: IOrder) => {
        let total = 0;
        const items = [];

        for (const item of order.products) {
            const product = await ProductModel.findById(item.id);
            if (!product) throw new TypeError("Cant find product");
            const itemPrice = item.amount * product.price;
            total += itemPrice;
            items.push({
                Name: product.name,
                Description: product.description,
                ImageUrl: `${baseUrl}/images/${product.imageURL}`,
                Quantity: item.amount,
                Unit: 'pcs',
                UnitPrice: product.price,
                ItemTotal: itemPrice
            });
        }

        const transactionData = {
            POSKey: POSKey,
            PaymentType: "Immediate",
            GuestCheckOut: true,
            FundingSources: ["All"],
            PaymentRequestId: `WEBSHOP-${order._id}-${Date.now()}`,
            RedirectUrl: `${baseUrl}/#/order/${order._id}`,
            CallbackUrl: `${baseUrl}/api/barion`,
            Transactions: [{
                POSTransactionId: `WEBSHOP-${order._id}-${Date.now()}/TR001`,
                Payee: adminEmail,
                Total: total,
                Items: items
            }],
            Locale: "hu-HU",
            Currency: baseCurrency
        }

        const responseData = await axios.post('https://api.test.barion.com/v2/Payment/Start', transactionData);

        const transaction = new TransactionModel();
        transaction.orderId = order._id;
        transaction.paymentId = responseData.data.PaymentId;
        transaction.paymentRequestId = responseData.data.PaymentRequestId;
        transaction.status = responseData.data.Status;
        transaction.gatewayUrl = responseData.data.GatewayUrl;
        await transaction.save();

        return transaction;
    }

    const finnishPayment = async (paymentId: string) => {
        const transactionStatus = await axios.get(`https://api.test.barion.com/v2/Payment/GetPaymentState?POSKey=${POSKey}&PaymentId=${paymentId}`);

        const transaction = await TransactionModel.findOne({paymentId: paymentId});
        if (!transaction) {
            throw new TypeError('Invalid transaction');
        }

        transaction.status = transactionStatus.data.Status;
        await transaction.save();

        return transaction;
    }

    return {startPayment, finnishPayment};
}