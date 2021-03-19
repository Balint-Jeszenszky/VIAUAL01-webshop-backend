/**
 * get the order details
 * orderid set on req.params.orderID
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IOrder, toOrderDTO } from '../../models/Order';

export default function(objRepo: ObjectRepository) {
    const OrerModel: Model<IOrder> = requireOption(objRepo, 'Order');

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const order = await OrerModel.findOne({ _id: req.params.orderID });
            if (order) {
                res.json(toOrderDTO(order));
            } else {
                res.sendStatus(404);
            }
        } catch(e) {
            next(e);
        }
    };
}
