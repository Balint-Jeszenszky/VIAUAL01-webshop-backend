/**
 * create new order
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IOrder } from '../../models/Order';
import { IUser } from '../../models/User';

export default function (objRepo: ObjectRepository) {
    const UserModel: Model<IUser> = requireOption(objRepo, 'User');
    const OrderModel: Model<IOrder> = requireOption(objRepo, 'Order');

    return async function (req: Request, res: Response, next: NextFunction) {

        try {
            const user = await UserModel.findById(req.params.userId);
            if (!user) return res.sendStatus(400);

            const order = new OrderModel();
            order.date = new Date();
            order.products = user.cart;
            order.paid = false;
            order.customer = res.locals.customer;
            order.customer.userId = user._id;
            await order.save();

            res.locals.order = order;
            return next();
        } catch (e) {
            return next(e);
        }
    };
}
