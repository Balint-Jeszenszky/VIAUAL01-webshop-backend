/**
 * returns the content of the users basket
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import mongoose from 'mongoose';
import {  } from '../../models/Product';

export default function(objRepo: ObjectRepository) {

    return async function (req: Request, res: Response, next: NextFunction) {
        res.json([{name: "cupidatat", description:"amet veniam", categoryID: "0", recommended: true, stock: 25, id: "0", "imageUrl": "sed officia et", price: 654}]);
    };
}
