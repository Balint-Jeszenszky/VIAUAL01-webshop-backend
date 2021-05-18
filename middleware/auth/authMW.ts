/**
 * check if the user is logged in
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IUser } from '../../models/User';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export default function(objRepo: ObjectRepository) {
    const UserModel: Model<IUser> = requireOption(objRepo, 'User');
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
        throw new TypeError('ACCESS_TOKEN_SECRET not set in .env');
    }

    return async function (req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        
        if (!token) {
            return res.sendStatus(401);
        }
        
        try {
            const data = jwt.verify(token, accessTokenSecret) as {userId: string};
            const user = await UserModel.findById(data.userId);
            if (!user || user.refreshToken === null) return res.sendStatus(403);
            res.locals.userId = user._id.toString();
            res.locals.userRole = user.role;
            return next();
        } catch (e) {
            if (e instanceof JsonWebTokenError) {
                if (e instanceof TokenExpiredError) {
                    try {
                        const user = await UserModel.findOne({ refreshToken: token });
                        if (user) {
                            user.refreshToken = null;
                            await user.save();
                        }
                    } catch (e) {
                        return next(e);
                    }
                }
                return res.sendStatus(403);
            }
            
            return next(e);
        }
    };
}
