/**
 * check the details of the customer
 */

import { Request, Response, NextFunction } from 'express';
import ObjectRepository from '../../models/ObjectRepository';

export default function (objRepo: ObjectRepository) {

    return function (req: Request, res: Response, next: NextFunction) {
        if (req.params.userId !== res.locals.userId ||
            req.body.name === undefined ||
            req.body.email === undefined ||
            req.body.address === undefined ||
            req.body.phoneNumber === undefined
        ) {
            return res.sendStatus(400);
        }

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(req.body.email.toLowerCase())) {
            return res.sendStatus(400);
        }

        res.locals.customer = {
            name: req.body.name, 
            email: req.body.email,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber
        }

        return next();
    }
}
