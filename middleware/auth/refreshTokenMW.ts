/**
 * update the access token with a refresh token
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IUser } from '../../models/User';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';

export default function (objRepo: ObjectRepository) {
    const UserModel: Model<IUser> = requireOption(objRepo, 'User');
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'test';
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'test';
    if (refreshTokenSecret === 'test' && process.env.NODE_ENV !== 'test') {
        throw new TypeError('REFRESH_TOKEN_SECRET not set in .env');
    }
    if (accessTokenSecret === 'test' && process.env.NODE_ENV !== 'test') {
        throw new TypeError('ACCESS_TOKEN_SECRET not set in .env');
    }

    return async function (req: Request, res: Response, next: NextFunction) {
        const refreshToken = req.body.refreshToken;
        if (refreshToken === undefined) return res.sendStatus(401);

        try {
            const data = jwt.verify(refreshToken, refreshTokenSecret) as {userId: string};
            const user = await UserModel.findById(data.userId);

            if (!user || user.refreshToken !== refreshToken) return res.sendStatus(401);

            const accessToken = jwt.sign({userId: user._id}, accessTokenSecret, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || '10m' });
            user.refreshToken = jwt.sign({userId: user._id}, refreshTokenSecret, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '4h' });
            await user.save();
            return res.json({ accessToken, refreshToken: user.refreshToken });
        } catch (e) {
            if (e instanceof JsonWebTokenError) {
                return res.sendStatus(401);
            }
            
            return next(e);
        }
    };
}
