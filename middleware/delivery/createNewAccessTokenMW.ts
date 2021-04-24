/**
 * create access token for delivery company
 */

import { Request, Response, NextFunction } from 'express';
import ObjectRepository from '../../models/ObjectRepository';
import jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { ICompany } from '../../models/Company'
import requireOption from '../generic/requireOption';

export default function (objRepo: ObjectRepository) {
    const CompanyModel: Model<ICompany> = requireOption(objRepo, 'Company');
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
        throw new TypeError('ACCESS_TOKEN_SECRET undefined');
    }

    return async function (req: Request, res: Response, next: NextFunction) {
        if (req.params.companyId === undefined) {
            return res.sendStatus(400);
        }

        try {
            const company = await CompanyModel.findById(req.params.companyId);
            if (!company) {
                return res.sendStatus(400);
            }

            const random = Math.random().toString(36).substring(2,10);
            company.accessToken = jwt.sign({ name: company.name, id: company._id, random }, accessTokenSecret!);
            await company.save();
            return res.json({accessToken: company.accessToken});
        } catch (e) {
            return next(e);
        }
    };
}
