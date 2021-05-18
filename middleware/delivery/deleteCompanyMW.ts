/**
 * delete company
 * the company ID is on req.params.companyId
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { ICompany } from '../../models/Company';

export default function (objRepo: ObjectRepository) {
    const CompanyModel: Model<ICompany> = requireOption(objRepo, 'Company');

    return async function (req: Request, res: Response, next: NextFunction) {
        if (req.params.companyId === undefined) {
            return res.sendStatus(400);
        }

        try {
            const company = await CompanyModel.findByIdAndDelete(req.params.companyId);
            if (company) {
                return res.sendStatus(204);
            }
            return res.sendStatus(404);
        } catch (e) {
            return next(e);
        }
    };
}
