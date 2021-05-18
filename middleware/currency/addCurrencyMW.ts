/**
 * accepted currencies on res.locals.currencies
 * all available currencies: res.locals.availableCurrencies
 */

import { Request, Response, NextFunction } from 'express';
import ObjectRepository from '../../models/ObjectRepository';
import { ICurrency } from '../../models/Currency';
import { Model } from 'mongoose';
import requireOption from '../generic/requireOption';

export default function (objRepo: ObjectRepository) {
    const CurrencyModel: Model<ICurrency> = requireOption(objRepo, 'Currency');

    return async function (req: Request, res: Response, next: NextFunction) {
        if (req.body.name === undefined || req.body.charge === undefined) {
            return res.sendStatus(400);
        }

        if (res.locals.currencies.find((e: ICurrency) => e.name === req.body.name)) {
            return res.sendStatus(409);
        }

        if (!(req.body.name in res.locals.availableCurrencies)) {
            return res.sendStatus(400);
        }

        try {
            const newCurrency = new CurrencyModel();
            newCurrency.name = req.body.name;
            newCurrency.charge = req.body.charge;
            newCurrency.price = res.locals.availableCurrencies[newCurrency.name];
            await newCurrency.save();
            return res.sendStatus(201);
        } catch (e) {
            return next(e);
        }
    };
}
