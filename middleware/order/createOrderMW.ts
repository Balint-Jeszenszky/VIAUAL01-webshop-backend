/**
 * create new order
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IOrder } from '../../models/Order';
import { IUser } from '../../models/User';
import { ITransaction } from '../../models/Transaction';
import { IProduct } from '../../models/Product';

export default function(objRepo: ObjectRepository) {
    const UserModel: Model<IUser> = requireOption(objRepo, 'User');
    const OrderModel: Model<IOrder> = requireOption(objRepo, 'Order');
    const ProductModel: Model<IProduct> = requireOption(objRepo, 'Product');

    return async function (req: Request, res: Response, next: NextFunction) {
        const transaction: ITransaction = res.locals.transaction;

        try {
            if (transaction.status === 'Succeeded') {
                const order = await OrderModel.findById(transaction.orderId);
                if (!order) {
                    return res.sendStatus(400);
                }
                order.paid = true;
                await order.save();
                const user = await UserModel.findById(order.customer.userId);
                if (!user) {
                    return res.sendStatus(400);
                }
                user.orders.push({id: order._id, date: order.date});
                user.cart = [];
                await user.save();

                for (const item of order.products) {
                    const product = await ProductModel.findById(item.id);
                    if (product) {
                        product.stock -= item.amount;
                        product.save();
                    }
                }
            }
            return res.sendStatus(200);
        } catch (e) {
            return next(e);
        }
    };
}
