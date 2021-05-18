/**
 * save a new product
 * details on req.body
 * image on req.file
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
            req.body.name === '' ||
            req.body.description === undefined ||
            req.body.description === '' ||
            req.body.categoryID === undefined ||
            req.body.price === undefined ||
            req.body.stock === undefined ||
            req.body.recommended === undefined ||
            req.file === undefined
        ) {
            return res.sendStatus(400);
        }

        // request object is FormData type because the picture
        // convert back to native type
        req.body.price = parseFloat(req.body.price);
        req.body.stock = parseInt(req.body.stock);
        req.body.recommended = req.body.recommended === 'true';

        const product = new ProductModel();
        product.name = req.body.name;
        product.description = req.body.description;
        product.imageURL = req.file.filename;
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
            return res.status(201).send({id: product._id});
        } catch (e) {
            return next(e);
        }
    };
}
