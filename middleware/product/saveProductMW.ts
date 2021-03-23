/**
 * save a new product
 * details on req.body
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
        if (req.body.name === undefined ||
            req.body.description === undefined ||
            req.body.categoryID === undefined ||
            req.body.price === undefined ||
            req.body.stock === undefined ||
            req.body.recommended === undefined
        ) {
            return res.sendStatus(400);
        }

        const product = new ProductModel();
        product.name = req.body.name;
        product.description = req.body.description;
        product.imageURL = req.body.imageURL;
        product.categoryID = req.body.categoryID;
        product.price = req.body.price;
        product.stock = req.body.stock;
        product.recommended = req.body.recommended;

        try {
            const category = await CategoryModel.findById(req.body.categoryID);
            if (category) {
                category.productNumber++;
                await category.save();
            }
        } catch (e) {
            return next(e);
        }

        try {
            await product.save();
            return res.sendStatus(201);
        } catch (e) {
            return next(e);
        }
    };
}
