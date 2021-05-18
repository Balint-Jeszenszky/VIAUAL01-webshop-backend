/**
 * add product to the users basket
 * userId is on req.params
 * new item is on req.body
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IProduct } from '../../models/Product';
import { IUser } from '../../models/User';

export default function (objRepo: ObjectRepository) {
    const UserModel: Model<IUser> = requireOption(objRepo, 'User');
    const ProductModel: Model<IProduct> = requireOption(objRepo, 'Product');

    return async function (req: Request, res: Response, next: NextFunction) {
        if (req.body.productId === undefined || req.body.amount === undefined) {
            return res.sendStatus(400);
        }
        
        try {
            const product = await ProductModel.findById(req.body.productId);
            if (product === null || product.stock < req.body.amount) {
                return res.sendStatus(400);
            }
        } catch (e) {
            return next(e);
        }

        try {
            const user = await UserModel.findById(req.params.userId);
            if (!user) {
                return res.sendStatus(400);
            }

            const idx = user.cart.findIndex(e => e.id === req.body.productId);
            if (idx !== -1) {
                user.cart[idx].amount += req.body.amount;
                user.markModified('cart');
            } else {
                user.cart = [...user.cart, {id: req.body.productId, amount: req.body.amount}];
            }

            await user.save();
            return res.sendStatus(201);
        } catch (e) {
            return next(e);
        }
    };
}
