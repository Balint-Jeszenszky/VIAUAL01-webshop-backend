/**
 * get all delivery companies
 * this is for admin
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { ICompany, toCompanyDTO } from '../../models/Company';

export default function (objRepo: ObjectRepository) {
    const CompanyModel: Model<ICompany> = requireOption(objRepo, 'Company');

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const companies = await CompanyModel.find({});
            res.json(companies.map(e => toCompanyDTO(e)));
        } catch (e) {
            next(e);
        }
    };
}
