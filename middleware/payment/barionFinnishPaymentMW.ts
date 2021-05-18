/**
 * finnish payment
 */

import { Request, Response, NextFunction } from 'express';
import ObjectRepository from '../../models/ObjectRepository';
import barionPayment from '../../externalServices/barionPayment';

export default function (objRepo: ObjectRepository) {
    const finnishPayment = barionPayment(objRepo).finnishPayment;

    return async function (req: Request, res: Response, next: NextFunction) {
        const paymentId = req.query.paymentId;

        if (paymentId === undefined || typeof paymentId !== 'string') {
            return res.sendStatus(400);
        }

        try {
            res.locals.transaction = await finnishPayment(paymentId);

            return next();
        } catch (e) {
            return next(e);
        }
    };
}
