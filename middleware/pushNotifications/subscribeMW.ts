/**
 * subscribe for notifications
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IUser } from '../../models/User';

export default function(objRepo: ObjectRepository) {
    const UserModel: Model<IUser> = requireOption(objRepo, 'User');

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UserModel.findById(res.locals.userId);
            if (user) {
                user.pushSubscription = req.body;
                await user.save();
                return res.sendStatus(201);
            }
            return res.sendStatus(404);
        } catch (e) {
            return next(e);
        }
    };
}
