/**
 * edit an existing category
 * id given in req.params.categoryId
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { ICategory } from '../../models/Category';

export default function (objRepo: ObjectRepository) {
    const CategoryModel: Model<ICategory> = requireOption(objRepo, 'Category');

    return async function (req: Request, res: Response, next: NextFunction) {
        if (req.params.categoryId === undefined || 
            req.body.id === undefined ||
            req.body.name === undefined ||
            req.params.categoryId !== req.body.id
        ) {
            return res.sendStatus(400);
        }

        try {
            const category = await CategoryModel.findById(req.params.categoryId);
            if (category) {
                category.name = req.body.name;
                await category.save();
                return res.sendStatus(204);
            }
            return res.sendStatus(404);
        } catch (e) {
            return next(e);
        }
    };
}
