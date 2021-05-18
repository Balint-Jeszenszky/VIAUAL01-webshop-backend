/**
 * start payment
 */

import { Request, Response, NextFunction } from 'express';
import ObjectRepository from '../../models/ObjectRepository';
import { IOrder } from '../../models/Order';
import barionPayment from '../../externalServices/barionPayment';
 
 export default function (objRepo: ObjectRepository) {
    const startPayment = barionPayment(objRepo).startPayment;

    return async function (req: Request, res: Response, next: NextFunction) {
        const order: IOrder = res.locals.order;

        try {
            const transaction = await startPayment(order);
            return res.json({ gatewayUrl: transaction.gatewayUrl });
        } catch (e) {
            return next(e);
        }
    };
}
