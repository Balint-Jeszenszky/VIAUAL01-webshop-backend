/**
 * get a list of products
 * category as :categoryID and page number as :page set on req.params
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IProduct, toProductDTO } from '../../models/Product';

export default function(objRepo: ObjectRepository) {
    const ProductModel: Model<IProduct> = requireOption(objRepo, 'Product');

    return async function (req: Request, res: Response, next: NextFunction) {
        const page = parseInt(req.params.page);
        if (isNaN(page)) {
            res.sendStatus(400);
        } else {
            try {
                const products = await ProductModel.find({ categoryID: req.params.categoryID }).skip(18 * (page - 1)).limit(18);
                res.json(products.map(e => toProductDTO(e)));
            } catch(e) {
                next(e);
            }
        }
    };
}
