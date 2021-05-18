/**
 * checks if the sent data is valid and save it to res.locals
 * otherwise write the errors to res.locals
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IUser } from '../../models/User';

export default function(objRepo: ObjectRepository) {
    const UserModel: Model<IUser> = requireOption(objRepo, 'User');

    return async function (req: Request, res: Response, next: NextFunction) {
        if (req.body.name === undefined ||
            req.body.username === undefined ||
            req.body.email === undefined ||
            req.body.password === undefined
        ) {
            return res.sendStatus(400);
        }

        const errors: string[] = [];
        try {
            const username = await UserModel.findOne({ username: req.body.username.toLowerCase() });
            if (username) {
                errors.push('username');
            }
        } catch (e) {
            next(e);
        }

        try {
            const email = await UserModel.findOne({ email: req.body.email });
            if (email) {
                errors.push('email_reg');
            }
        } catch (e) {
            next(e);
        }

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(req.body.email.toLowerCase())) {
            errors.push('email_invalid');
        }
    
        if (req.body.password.length < 8) {
            errors.push('pass_short');
        }

        if (errors.length) {
            return res.status(409).json({errors})
        }

        next();
    };
}
