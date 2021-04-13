/**
 * delete currency
 * currencyId set on req.params.currencyId
 */

import { Request, Response, NextFunction } from 'express';
import ObjectRepository from '../../models/ObjectRepository';
import { ICurrency } from '../../models/Currency';
import { Model } from 'mongoose';
import requireOption from '../generic/requireOption';

export default function (objRepo: ObjectRepository) {
    const CurrencyModel: Model<ICurrency> = requireOption(objRepo, 'Currency');

    return async function (req: Request, res: Response, next: NextFunction) {
        if (req.params.currencyId === undefined) {
            return res.sendStatus(400);
        }

        if (!res.locals.currencies.find((e: ICurrency) => e.id === req.params.currencyId)) {
            return res.sendStatus(400);
        }

        try {
            await CurrencyModel.findByIdAndDelete(req.params.currencyId);
            return res.sendStatus(204);
        } catch (e) {
            return next(e);
        }
    };
}
