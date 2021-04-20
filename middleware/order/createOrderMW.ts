/**
 * create new order
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IOrder } from '../../models/Order';
import User, { IUser } from '../../models/User';
import { ITransaction } from '../../models/Transaction';

export default function(objRepo: ObjectRepository) {
    const UserModel: Model<IUser> = requireOption(objRepo, 'User');
    const OrderModel: Model<IOrder> = requireOption(objRepo, 'Order');

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
                const user = await UserModel.findById(await UserModel.aggregate([
                    {
                        $unwind: '$orders'
                    },
                    {
                        $match: {
                            'orders.id': order._id
                        }
                    },
                    {
                        $project: { _id: 1 }
                    }
                ]));
                if (!user) {
                    return res.sendStatus(400);
                }
                user.cart = [];
                await user.save();
            }
            res.sendStatus(200);
        } catch (e) {
            return next(e);
        }
    };
}
