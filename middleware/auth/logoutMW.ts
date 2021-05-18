/**
 * delete the refresh token from the database
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IUser } from '../../models/User';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';

export default function (objRepo: ObjectRepository) {
    const UserModel: Model<IUser> = requireOption(objRepo, 'User');
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
        throw new TypeError('ACCESS_TOKEN_SECRET not set in .env');
    }

    return async function (req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        const accessToken = authHeader?.split(' ')[1];

        if (!accessToken) {
            return res.sendStatus(401);
        }

        try {
            const data = jwt.verify(accessToken, accessTokenSecret) as { userId: string };
            const user = await UserModel.findById(data.userId);

            if (!user) return res.sendStatus(401);

            user.refreshToken = null;
            await user.save();
            return res.sendStatus(204);
        } catch (e) {
            if (e instanceof JsonWebTokenError) {
                return res.sendStatus(401);
            }

            return next(e);
        }
    };
}
