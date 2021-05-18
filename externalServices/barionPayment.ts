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
import { ICurrency } from '../models/Currency';

export default function(objRepo: ObjectRepository) {
    const ProductModel: Model<IProduct> = requireOption(objRepo, 'Product');
    const TransactionModel: Model<ITransaction> = requireOption(objRepo, 'Transaction');
    const CurrencyModel: Model<ICurrency> = requireOption(objRepo, 'Currency');
    const baseUrl = process.env.WEBSITE_BASE_URL;
    const POSKey = process.env.BARION_POSKEY;
    const baseCurrency = process.env.DEFAULT_CURRENCY;
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!baseUrl || !POSKey || !baseCurrency || !adminEmail) {
        throw new TypeError('WEBSITE_BASE_URL, BARION_POSKEY, DEFAULT_CURRENCY or ADMIN_EMAIL undefined');
    }

    const startPayment = async (order: IOrder) => {

        let currency = order.currency;
        let locale: string;

        const currencies = ['EUR', 'HUF', 'USD', 'CZK'];
        const locales = ['en-US', 'hu-HU', 'en-US', 'cs-CZ'];

        let idx = currencies.findIndex(c => c === currency);

        if (idx === -1) {
            currency = baseCurrency;
            if (currencies.findIndex(c => c === currency)) {
                currency = currencies[0];
                idx = 0;
            }
        }

        order.currency = currency;
        await order.save();

        locale = locales[idx];

        let multiplyer = 1;
        if (currency !== baseCurrency) {
            const currencyData = await CurrencyModel.findOne({name: currency});
            if (currencyData) {
                multiplyer *= currencyData.price * (1 + currencyData.charge);
            }
        }
        
        let total = 0;
        const items = [];

        for (const item of order.products) {
            const product = await ProductModel.findById(item.id);
            if (!product) throw new TypeError('Cant find product');
            const itemPrice = parseFloat((item.amount * product.price * multiplyer).toFixed(2));
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
            PaymentType: 'Immediate',
            GuestCheckOut: true,
            FundingSources: ['All'],
            PaymentRequestId: `WEBSHOP-${order._id}-${Date.now()}`,
            RedirectUrl: `${baseUrl}/order/${order._id}`,
            CallbackUrl: `${baseUrl}/api/barion`,
            Transactions: [{
                POSTransactionId: `WEBSHOP-${order._id}-${Date.now()}/TR001`,
                Payee: adminEmail,
                Total: total,
                Items: items
            }],
            Locale: locale,
            Currency: currency
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