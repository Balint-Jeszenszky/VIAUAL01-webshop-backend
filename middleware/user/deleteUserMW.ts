/**
 * deletes the user account
 * userID set on req.params
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
            const user = await UserModel.findByIdAndDelete(req.params.userID);
            if (user) {
                return res.sendStatus(204);
            } else {
                return res.sendStatus(400);
            }
        } catch (e) {
            return next(e);
        }
    };
}
