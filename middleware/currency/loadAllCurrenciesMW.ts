/**
 * get available currencies
 * put it to res.locals.availableCurrencies
 */

import { Request, Response, NextFunction } from 'express';
import getAvailableCurrencies from '../../externalServices/getAvailableCurrencies';
import ObjectRepository from '../../models/ObjectRepository';

export default function (objRepo: ObjectRepository) {
    const base = process.env.DEFAULT_CURRENCY;
    const apiKey = process.env.EXCHANGERATES_API_KEY;
    if (!base || !apiKey) {
        throw new TypeError('currency base or exchange api key undefined');
    }

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            res.locals.availableCurrencies = await getAvailableCurrencies(base!, apiKey!);
            return next();
        } catch (e) {
            return next(e);
        }
    };
}
