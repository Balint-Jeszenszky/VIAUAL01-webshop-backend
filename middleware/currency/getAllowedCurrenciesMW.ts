/**
 * get the accepted currencies
 */

import { Request, Response, NextFunction } from 'express';
import ObjectRepository from '../../models/ObjectRepository';
import { ICurrency } from '../../models/Currency';

export default function (objRepo: ObjectRepository) {
    return async function (req: Request, res: Response, next: NextFunction) {
        res.json([{name: process.env.DEFAULT_CURRENCY, charge: 0}, ...res.locals.currencies.map(
            (e: ICurrency) => {
                return {
                    id: e._id,
                    name: e.name,
                    charge: e.charge
                }
            })
        ]);
    };
}
