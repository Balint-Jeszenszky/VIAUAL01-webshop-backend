/**
 * update user details
 * details on res.body
 */

import { Request, Response, NextFunction } from 'express';
import ObjectRepository from '../../models/ObjectRepository';

export default function(objRepo: ObjectRepository) {

    return async function (req: Request, res: Response, next: NextFunction) {
        const user = res.locals.user;
        user.name = req.body.name;
        user.email = req.body.email;
        user.phoneNumber = req.body.phoneNumber;
        user.address = req.body.address;
        if (res.locals.password) user.password = res.locals.password;

        try {
            await user.save();
            return res.sendStatus(204);
        } catch (e) {
            return next(e);
        }
    };
}
