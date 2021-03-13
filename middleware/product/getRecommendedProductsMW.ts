/**
 * Gets the recommended products from the database
 * Responds with a json array of recommended products
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import mongoose from 'mongoose';
import { IProduct, toProductDAO } from '../../models/Product';

export default function(objRepo: ObjectRepository) {
    const ProductModel: mongoose.Model<IProduct> = requireOption(objRepo, 'Product');

    return async function (req: Request, res: Response, next: NextFunction) {
        const products = await ProductModel.find({ recommended: true});
        res.json(products.map(e => toProductDAO(e)));
    };
}
