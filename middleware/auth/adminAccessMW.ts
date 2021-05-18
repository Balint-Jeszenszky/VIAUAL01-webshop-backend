/**
 * restricts access to admin only
 */

import { Request, Response, NextFunction } from 'express';
import ObjectRepository from '../../models/ObjectRepository';

export default function (objRepo: ObjectRepository) {

    return function (req: Request, res: Response, next: NextFunction) {
        if (res.locals.userRole !== 'ADMIN') {
            return res.sendStatus(403);
        }
        return next();
    };
}
