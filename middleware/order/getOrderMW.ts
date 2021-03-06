/**
 * get the order details
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import mongoose from 'mongoose';
import {  } from '../../models/Product';

export default function(objRepo: ObjectRepository) {

    return async function (req: Request, res: Response, next: NextFunction) {
        res.json({id: '0', products: [{id: '0', amount: 2}]});
    };
}
