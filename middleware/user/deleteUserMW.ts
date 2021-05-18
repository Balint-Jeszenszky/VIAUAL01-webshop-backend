/**
 * deletes the user account
 * userId set on req.params
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IUser } from '../../models/User';

export default function(objRepo: ObjectRepository) {
    const UserModel: Model<IUser> = requireOption(objRepo, 'User');

    return async function (req: Request, res: Response, next: NextFunction) {
        if (res.locals.userId !== req.params.userId) {
            return res.sendStatus(403);
        }

        try {
            const user = await UserModel.findByIdAndDelete(req.params.userId);
            if (user) {
                return res.sendStatus(204);
            }
            return res.sendStatus(404);
        } catch (e) {
            return next(e);
        }
    };
}
