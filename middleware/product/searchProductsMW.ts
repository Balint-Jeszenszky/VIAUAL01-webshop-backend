/**
 * search for products
 * details on req.params: query :query, page :page
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IProduct, toProductDTO } from '../../models/Product';

export default function(objRepo: ObjectRepository) {
    const ProductModel: Model<IProduct> = requireOption(objRepo, 'Product');

    return async function (req: Request, res: Response, next: NextFunction) {
        const query = (req.params.query as string).split('+').map(w => `"${w}"`).join(' ');
        try {
            const products = await ProductModel.find({ $text: { $search: query}});
            res.json(products.map(e => toProductDTO(e, res.locals.currencies)));
        } catch (e) {
            next(e);
        }
    };
}
