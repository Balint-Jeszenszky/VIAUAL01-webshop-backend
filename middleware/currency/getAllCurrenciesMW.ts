/**
 * get all the currencies
 */

import { Request, Response, NextFunction } from 'express';
import ObjectRepository from '../../models/ObjectRepository';

export default function (objRepo: ObjectRepository) {
    return async function (req: Request, res: Response, next: NextFunction) {
        return res.json(res.locals.availableCurrencies);
    };
}
