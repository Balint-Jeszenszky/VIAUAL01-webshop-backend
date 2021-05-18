/**
 * update the accepted currencies
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { ICurrency } from '../../models/Currency';

export default function(objRepo: ObjectRepository) {
    const CurrencyModel: Model<ICurrency> = requireOption(objRepo, 'Currency');

    return async function (req: Request, res: Response, next: NextFunction) {
        if (req.params.currencyId === undefined || 
            req.body.name === undefined || 
            req.body.charge === undefined
        ) {
            return res.sendStatus(400);
        }
        
        try {
            const currency = await CurrencyModel.findById(req.params.currencyId);
            if (!currency || currency.name !== req.body.name) {
                return res.sendStatus(404);
            }
            currency.charge = req.body.charge;
            await currency.save();
            return res.sendStatus(204);
        } catch (e) {
            return next(e);
        }
    };
}
