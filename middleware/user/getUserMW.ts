/**
 * get the user's details
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import mongoose from 'mongoose';
import {  } from '../../models/Product';

export default function(objRepo: ObjectRepository) {

    return async function (req: Request, res: Response, next: NextFunction) {
        res.json({id: '0', name: 'Joe', username: 'joe52', email: 'asd@mail.com', address: 'example street', phoneNumber: '+36201234567'});
    };
}
