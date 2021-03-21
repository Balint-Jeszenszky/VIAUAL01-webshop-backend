/**
 * set accepted currencies to res.locals
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { ICurrency } from '../../models/Currency';

export default function(objRepo: ObjectRepository) {
    const CurrencyModel: Model<ICurrency> = requireOption(objRepo, 'Currency');

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            res.locals.currencies = await CurrencyModel.find({});
            next();
        } catch (e) {
            next(e);
        }
    };
}
