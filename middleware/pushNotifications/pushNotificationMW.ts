/**
 * send notification to user
 * orderId set on res.locals.orderId
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
    } else if (process.env.NODE_ENV !== 'test') {
        webPush.setVapidDetails(`mailto:${process.env.ADMIN_EMAIL}`, publicVapidKey, privateVapidKey);
    }

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            if (res.locals.orderId) {
                const user = await UserModel.findById(
                    await UserModel.aggregate([
                        {
                            $unwind: '$orders'
                        },
                        {
                            $match: {
                                'orders.id': res.locals.orderId
                            }
                        },
                        {
                            $project: { _id: 1 }
                        }
                    ])
                );

                const payload = JSON.stringify({ title: 'Delivery update', body: 'Your order is under delivery\nYou can see it in your orders' });

                await webPush.sendNotification(user!.pushSubscription!, payload);
            }

            return res.sendStatus(204);
        } catch (e) {
            return next(e);
        }
    };
}
