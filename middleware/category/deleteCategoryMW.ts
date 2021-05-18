/**
 * delete a category 
 * id given in req.params.categoryId
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { ICategory } from '../../models/Category';

export default function(objRepo: ObjectRepository) {
    const CategoryModel: Model<ICategory> = requireOption(objRepo, 'Category');

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const category = await CategoryModel.findByIdAndDelete(req.params.categoryId);
            if (category)
                return res.sendStatus(204);
            return res.sendStatus(404);
        } catch (e) {
            return next(e);
        }
    };
}
