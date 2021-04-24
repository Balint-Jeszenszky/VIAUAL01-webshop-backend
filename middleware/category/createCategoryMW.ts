/**
 * create new category
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { ICategory } from '../../models/Category';

export default function(objRepo: ObjectRepository) {
    const CategoryModel: Model<ICategory> = requireOption(objRepo, 'Category');

    return async function (req: Request, res: Response, next: NextFunction) {
        if (req.body.name === undefined) {
            return res.sendStatus(400);
        }
        
        try {
            const exists = await CategoryModel.exists({ name: req.body.name });
            if (exists) {
                return res.sendStatus(409);
            }
        } catch(e) {
            return next(e);
        }

        const newCategory = new CategoryModel();
        newCategory.name = req.body.name;
        newCategory.productNumber = 0;

        try {
            await newCategory.save();
            return res.status(201).json(newCategory);
        } catch (e) {
            return next(e);
        }
    };
}
