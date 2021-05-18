/**
 * get all categories from the database
 * responds with an array of categories
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { ICategory, toCategoryDTO } from '../../models/Category';

export default function(objRepo: ObjectRepository) {
    const CategoryModel: Model<ICategory> = requireOption(objRepo, 'Category');

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await CategoryModel.find({}).sort({ name: 1 });
            res.json(categories.map(e => toCategoryDTO(e)));
        } catch (e) {
            next(e);
        }
    };
}
