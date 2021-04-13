/**
 * create access token for delivery company
 */

import { Request, Response, NextFunction } from 'express';
import ObjectRepository from '../../models/ObjectRepository';
import jwt from 'jsonwebtoken';

export default function (objRepo: ObjectRepository) {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret && process.env.NODE_ENV !== 'test') {
        throw new TypeError('ACCESS_TOKEN_SECRET undefined');
    }

    return async function (req: Request, res: Response, next: NextFunction) {
        const accessToken = jwt.sign({key: Math.round(Math.random()*100000000)}, accessTokenSecret!);

        res.json({accessToken});
    };
}
