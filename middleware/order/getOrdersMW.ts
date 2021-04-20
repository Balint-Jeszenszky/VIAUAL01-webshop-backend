/**
 * get all orders
 * this is for admin
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IOrder, toOrderDTO } from '../../models/Order';

export default function(objRepo: ObjectRepository) {
    const OrderModel: Model<IOrder> = requireOption(objRepo, 'Order');

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const orders = await OrderModel.find({paid: true});
            res.json(orders.map(e => toOrderDTO(e)));
        } catch(e) {
            next(e);
        }
    };
}
