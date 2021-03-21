/**
 * get the accepted currencies
 */

import { Request, Response, NextFunction } from 'express';
import ObjectRepository from '../../models/ObjectRepository';
import { ICurrency } from '../../models/Currency';

export default function (objRepo: ObjectRepository) {
    return async function (req: Request, res: Response, next: NextFunction) {
            res.json([process.env.DEFAULT_CURRENCY, ...res.locals.currencies.map((e: ICurrency) => e.name)]);
    };
}
