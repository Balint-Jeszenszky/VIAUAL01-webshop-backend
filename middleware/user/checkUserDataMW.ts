/**
 * check if the user details are correct
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IUser } from '../../models/User';
import bcrypt from 'bcrypt';

export default function(objRepo: ObjectRepository) {
    const UserModel: Model<IUser> = requireOption(objRepo, 'User');
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'test';
    if (accessTokenSecret === 'test' && process.env.NODE_ENV !== 'test') {
        throw new TypeError('HASH_SECRET not set in .env');
    }

    return async function (req: Request, res: Response, next: NextFunction) {
        if (req.body === undefined ||
            req.params.userrID !== req.body.userId ||
            req.params.userrID ||
            req.body.name === undefined ||
            req.body.email === undefined
        ) {
            return res.sendStatus(400);
        }

        const errors = [];

        try {
            const user = await UserModel.findOne({ email: req.body.email });
            if (user && user._id != req.params.userId) {
                console.log(typeof user._id)
                errors.push('email_reg');
            }
        } catch (e) {
            return next(e);
        }

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(req.body.email.toLowerCase())) {
            errors.push('email_invalid');
        }
        
        const user = await UserModel.findById(req.params.userId);
        if (!user) return res.sendStatus(400);

        if (req.body.oldPassword !== undefined) {
            let passSet = true;
            if (!req.body.newPassword) {
                errors.push('new_pass_required');
                passSet = false;
            }

            if (!req.body.confirmPassword) {
                errors.push('confirm_pass_required');
                passSet = false;
            }

            if (passSet) {
                if (req.body.newPassword.length < 8) {
                    errors.push('pass_short');
                }

                let oldPassword;
                try {
                    oldPassword = await bcrypt.hash(req.body.password, 10);
                } catch (e) {
                    return next(e);
                }

                if (oldPassword !== user.password) {
                    errors.push('wrong_pass');
                }

                if (req.body.newPassword !== req.body.confirmPassword) {
                    errors.push('pass_not_match');
                }
                res.locals.password = await bcrypt.hash(req.body.password, 10);
            }
        }

        if (errors.length) {
            return res.status(409).json({errors})
        }

        res.locals.user = user;

        return next();
    };
}
