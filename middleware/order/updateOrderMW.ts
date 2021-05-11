/**
 * update the order
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IOrder } from '../../models/Order';

export default function(objRepo: ObjectRepository) {
    const OrderModel: Model<IOrder> = requireOption(objRepo, 'Order');

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const order = await OrderModel.findById(req.body.id);
            if (order) {
                order.mapsAPI = req.body.mapsAPI;
                await order.save();
                if (order.mapsAPI) {
                    res.locals.orderId = order._id;
                }
                return next();
            }
            return res.sendStatus(404);
        } catch (e) {
            return next(e);
        }
    };
}
