/**
 * checks login credentials and returns the user if the credentials are valid
 * otherwise respond with 401 - Unauthorized
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import mongoose from 'mongoose';
import {  } from '../../models/Product';

export default function(objRepo: ObjectRepository) {

    return async function (req: Request, res: Response, next: NextFunction) {
        res.json({name: 'Joe'});
    };
}
