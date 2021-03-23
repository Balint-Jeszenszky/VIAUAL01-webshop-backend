/**
 * delete oone product 
 * the product ID is on req.params.productID
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IProduct } from '../../models/Product';
import { ICategory } from '../../models/Category';

export default function(objRepo: ObjectRepository) {
    const ProductModel: Model<IProduct> = requireOption(objRepo, 'Product');
    const CategoryModel: Model<ICategory> = requireOption(objRepo, 'Category');

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const product = await ProductModel.findByIdAndDelete(req.params.productID);
            if (product) {
                const category = await CategoryModel.findById(product.categoryID);
                if (category) {
                    category.productNumber--;
                    await category.save();
                }
                return res.sendStatus(204);
            }
            return res.sendStatus(404);
        } catch (e) {
            return next(e);
        }
    };
}
