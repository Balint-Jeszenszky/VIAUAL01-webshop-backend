/**
 * return the vapid key for subscription
 */

 import { Request, Response, NextFunction } from 'express';
 import ObjectRepository from '../../models/ObjectRepository';
 
 export default function(objRepo: ObjectRepository) {
    const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
    if (!publicVapidKey) {
        throw new TypeError('no vapid key');
    }
 
     return async function (req: Request, res: Response, next: NextFunction) {
         return res.json({publicVapidKey});
     };
 }
 