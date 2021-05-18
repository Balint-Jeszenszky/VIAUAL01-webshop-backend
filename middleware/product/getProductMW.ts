/**
 * get details of a product
 * productID set on req.params.productID
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IProduct, toProductDTO } from '../../models/Product';

export default function(objRepo: ObjectRepository) {
    const ProductModel: Model<IProduct> = requireOption(objRepo, 'Product');

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const product = await ProductModel.findOne({ _id: req.params.productID });
            if (product) {
                res.json(toProductDTO(product, res.locals.currencies));
            } else {
                res.sendStatus(404);
            }
        } catch(e) {
            next(e);
        }
    };
}
