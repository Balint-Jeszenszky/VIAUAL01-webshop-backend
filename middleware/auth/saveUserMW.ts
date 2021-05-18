/**
 * saves reg data from res.locals if no errors
 * otherwise respond with 401 - Unauthorized
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { IUser } from '../../models/User';

export default function(objRepo: ObjectRepository) {
    const UserModel: Model<IUser> = requireOption(objRepo, 'User');

    return async function (req: Request, res: Response, next: NextFunction) {
        let passwordHash;
        try {
            passwordHash = await bcrypt.hash(req.body.password, 10);
        } catch (e) {
            return next(e);
        }

        const newUser = new UserModel();
        newUser.name = req.body.name;
        newUser.username = req.body.username.toLowerCase();
        newUser.email = req.body.email;
        newUser.password = passwordHash;
        newUser.phoneNumber = '';
        newUser.address = '';
        newUser.orders = [];
        newUser.cart = [];
        newUser.role = 'USER';

        try {
            await newUser.save();
            return res.sendStatus(201);
        } catch (e) {
            return next(e);
        }
    };
}
