/**
 * get a list of products
 * category and page number set on req.params
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import mongoose from 'mongoose';
import {  } from '../../models/Product';

export default function(objRepo: ObjectRepository) {

    return async function (req: Request, res: Response, next: NextFunction) {
        res.json([{id: '0', name :'ceruza', description: 'grafit'+req.params.categoryID, imageURL: '640x480.png', categoryID: '1', price: {HUF: 85, EUR: 0.229, USD: 0.274}, stock: 100, recommended: true}]);
    };
}
