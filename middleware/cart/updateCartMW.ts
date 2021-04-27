/**
 * updates the users basket
 * userId is on req.params
 * updated cart is on req.body
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IProduct } from '../../models/Product';
import { IUser, ListItem } from '../../models/User';

export default function(objRepo: ObjectRepository) {
    const UserModel: Model<IUser> = requireOption(objRepo, 'User');
    const ProductModel: Model<IProduct> = requireOption(objRepo, 'Product');

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            for (const e of req.body) {
                const product = await ProductModel.findById(e.id);
                if (product === null || product.stock < e.amount) {
                    return res.sendStatus(400);
                }
            }
        } catch (e) {
            return next(e);
        }
        const cart: ListItem[] = req.body.filter((e: ListItem) => e.amount > 0);

        try {
            const user = await UserModel.findById(req.params.userId);
            if (!user) {
                return res.sendStatus(400);
            }
            user.cart = cart;
            await user.save();
            return res.sendStatus(204);
        } catch (e) {
            return next(e);
        }
    };
}
