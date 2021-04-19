/**
 * update details of a product
 * id is on req.params
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
        console.log(req.file);
        if (req.body.name === undefined ||
            req.body.name === '' ||
            req.body.description === undefined ||
            req.body.description === '' ||
            req.body.categoryID === undefined ||
            req.body.price === undefined ||
            req.body.stock === undefined ||
            req.body.recommended === undefined ||
            req.params.productID !== req.body.id
        ) {
            return res.sendStatus(400);
        }

        // request object is FormData type because the picture
        // convert back to native type
        req.body.price = parseFloat(req.body.price);
        req.body.stock = parseInt(req.body.stock);
        req.body.recommended = req.body.recommended === 'true';

        try {
            const product = await ProductModel.findById(req.body.id);
            if (product) {
                if (product.categoryID !== req.body.categoryID) {
                    const oldCat = await CategoryModel.findById(product.categoryID);
                    const newCat = await CategoryModel.findById(req.body.categoryID);

                    if (oldCat) {
                        oldCat.productNumber--;
                        await oldCat.save();
                    }

                    if (newCat) {
                        newCat.productNumber++;
                        await newCat.save();
                    }
                }

                product.name = req.body.name;
                product.description = req.body.description;
                if (req.file !== undefined) {
                    product.imageURL = req.file.filename;
                }
                product.categoryID = req.body.categoryID;
                product.price = req.body.price;
                product.stock = req.body.stock;
                await product.save();
                return res.sendStatus(204);
            }

            return res.sendStatus(404);
        } catch (e) {
            return next(e);
        }
    };
}
