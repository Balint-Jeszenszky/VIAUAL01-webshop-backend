/**
 * saves reg data from res.locals if no errors
 * otherwise respond with 401 - Unauthorized
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import crypto from 'crypto';
import { Model } from 'mongoose';
import { IUser } from '../../models/User';

export default function(objRepo: ObjectRepository) {
    const UserModel: Model<IUser> = requireOption(objRepo, 'User');
    const hashSecret = process.env.HASH_SECRET;
    if (!hashSecret) {
        throw new TypeError('HASH_SECRET not set in .env');
    }

    return async function (req: Request, res: Response, next: NextFunction) {
        const password = crypto.createHmac("sha512", hashSecret).update(req.body.password).digest("base64");
        const newUser = new UserModel();
        newUser.name = req.body.name;
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.password = password;
        newUser.phoneNumber = '';
        newUser.address = '';
        newUser.orders = [];
        newUser.cart = [];

        try {
            await newUser.save();
            return res.sendStatus(201);
        } catch (e) {
            return next(e);
        }
    };
}
