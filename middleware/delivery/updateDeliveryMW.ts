/**
 * update details of delivery
 * details on req.body
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IOrder } from '../../models/Order';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';

export default function(objRepo: ObjectRepository) {
    const OrderModel: Model<IOrder> = requireOption(objRepo, 'Order');
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || '';
    if (!accessTokenSecret && process.env.NODE_ENV !== 'test') {
        throw new TypeError('ACCESS_TOKEN_SECRET undefined');
    }

    return async function (req: Request, res: Response, next: NextFunction) {
        if (req.body.orderId === undefined || req.body.accessToken === undefined || req.body.coords === undefined)
        
        if (!req.body.accessToken) {
            return res.sendStatus(401);
        }

        try {
            jwt.verify(req.body.accessToken, accessTokenSecret);
            const order = await OrderModel.findById(req.body.orderId);
            if (!order) {
                return res.sendStatus(400);
            }
            order.mapsAPI!.coords = req.body.coords;
            await order.save();
            return res.sendStatus(204);
        } catch (e) {
            if (e instanceof JsonWebTokenError) {
                return res.sendStatus(403);
            }
            return next(e);
        }
    };
}
