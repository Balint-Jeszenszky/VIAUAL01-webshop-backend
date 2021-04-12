/**
 * checks login credentials and returns the user if the credentials are valid
 * otherwise respond with 401 - Unauthorized
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { IUser } from '../../models/User';
import jwt from 'jsonwebtoken';

export default function(objRepo: ObjectRepository) {
    const UserModel: Model<IUser> = requireOption(objRepo, 'User');
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'test';
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'test';
    if (accessTokenSecret === 'test' && process.env.NODE_ENV !== 'test') {
        throw new TypeError('ACCESS_TOKEN_SECRET not set in .env');
    }
    if (refreshTokenSecret === 'test' && process.env.NODE_ENV !== 'test') {
        throw new TypeError('REFRESH_TOKEN_SECRET not set in .env');
    }

    return async function (req: Request, res: Response, next: NextFunction) {
        if (req.body.username === undefined || req.body.password === undefined) {
            return res.sendStatus(400);
        }

        let user;

        try {
            user = await UserModel.findOne({ username: req.body.username });
            if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
                return res.sendStatus(403);
            }
            user.refreshToken = jwt.sign({userId: user._id, role: user.role}, refreshTokenSecret, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '4h' });
            await user.save();
        } catch (e) {
            return next(e);
        }

        const accessToken = jwt.sign({userId: user._id, role: user.role}, accessTokenSecret, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || '10m' });

        return res.json({accessToken, refreshToken: user.refreshToken});
    };
}
