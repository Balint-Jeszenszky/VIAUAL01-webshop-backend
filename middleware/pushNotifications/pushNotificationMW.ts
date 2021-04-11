/**
 * send notification
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IUser } from '../../models/User';
import webPush from 'web-push';

export default function (objRepo: ObjectRepository) {
    const UserModel: Model<IUser> = requireOption(objRepo, 'User');
    const publicVapidKey = process.env.VAPID_PUBLIC_KEY || '';
    const privateVapidKey = process.env.VAPID_PRIVATE_KEY || '';
    if ((!publicVapidKey || !privateVapidKey) && process.env.NODE_ENV !== 'test') {
        throw new TypeError('no vapid key');
    }

    webPush.setVapidDetails('mailto:admin@localhost', publicVapidKey, privateVapidKey);

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UserModel.findOne({});

            const payload = JSON.stringify({ title: 'push test', body: 'it works!' });

            await webPush.sendNotification(user!.pushSubscription!, payload);

            return res.sendStatus(204);
        } catch (e) {
            return next(e);
        }
    };
}
