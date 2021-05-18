/**
 * create new company
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { ICompany, toCompanyDTO } from '../../models/Company';
import jwt from 'jsonwebtoken';

export default function (objRepo: ObjectRepository) {
    const CompanyModel: Model<ICompany> = requireOption(objRepo, 'Company');
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
        throw new TypeError('ACCESS_TOKEN_SECRET undefined');
    }

    return async function (req: Request, res: Response, next: NextFunction) {
        if (req.body.name === undefined) {
            return res.sendStatus(400);
        }

        try {
            const random = Math.random().toString(36).substring(2,10);
            const company = new CompanyModel();
            company.name = req.body.name;
            company.accessToken = random;
            await company.save();
            company.accessToken = jwt.sign({ name: company.name, id: company._id, random }, accessTokenSecret!);
            await company.save();
            res.status(201).json(toCompanyDTO(company));
        } catch (e) {
            next(e);
        }
    };
}
