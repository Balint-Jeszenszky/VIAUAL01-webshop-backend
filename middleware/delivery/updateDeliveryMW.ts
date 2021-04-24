/**
 * update details of delivery
 * details on req.body
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IOrder } from '../../models/Order';
import { ICompany } from '../../models/Company';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';

export default function(objRepo: ObjectRepository) {
    const OrderModel: Model<IOrder> = requireOption(objRepo, 'Order');
    const CompanyModel: Model<ICompany> = requireOption(objRepo, 'Company');
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
        throw new TypeError('ACCESS_TOKEN_SECRET undefined');
    }

    return async function (req: Request, res: Response, next: NextFunction) {
        if (req.body.orderId === undefined || req.body.accessToken === undefined || req.body.coords === undefined) {
            return res.sendStatus(400);
        }

        try {
            const companyId = (jwt.verify(req.body.accessToken, accessTokenSecret) as {id: string}).id;
            const company = await CompanyModel.findById(companyId);
            if (!company || company.accessToken !== req.body.accessToken) {
                return res.sendStatus(403);
            }
            const order = await OrderModel.findById(req.body.orderId);
            if (!order || !order.mapsAPI) {
                return res.sendStatus(400);
            }
            order.mapsAPI.coords = req.body.coords;
            order.markModified('mapsAPI');
            await order.save();
            return res.sendStatus(204);
        } catch (e) {
            if (e instanceof JsonWebTokenError) {
                return res.sendStatus(403);
            }
            return next(e);
        }
    };
}
