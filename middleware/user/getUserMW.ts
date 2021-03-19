/**
 * get the user's details
 * :userID set or req.params
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IUser, toUserDTO } from '../../models/User';

export default function(objRepo: ObjectRepository) {
    const UserModel: Model<IUser> = requireOption(objRepo, 'User');

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UserModel.findOne({ _id: req.params.userID });
            if (user) {
                res.json(toUserDTO(user));
            } else {
                res.sendStatus(404);
            }
        } catch(e) {
            next(e);
        }
    };
}
