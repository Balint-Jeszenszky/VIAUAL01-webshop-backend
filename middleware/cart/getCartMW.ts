/**
 * returns the content of the users basket
 * userId set on req.params.userId
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IUser } from '../../models/User';
import { IProduct, toProductDTO } from '../../models/Product';

export default function(objRepo: ObjectRepository) {
    const UserModel: Model<IUser> = requireOption(objRepo, 'User');
    const ProductModel: Model<IProduct> = requireOption(objRepo, 'Product');

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UserModel.findOne({ _id: req.params.userId });
            if (user) {
                const cart = [];
                for (const prod of user.cart) {
                    const product = await ProductModel.findOne({ _id: prod.id });
                    if (product) cart.push({product: toProductDTO(product, res.locals.currencies), amount: prod.amount});
                }
                res.json(cart);
            } else {
                res.sendStatus(404);
            }
        } catch(e) {
            next(e);
        }
    };
}
