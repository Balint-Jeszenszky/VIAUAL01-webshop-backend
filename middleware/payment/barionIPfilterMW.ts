/**
 * filter barion IPs
 */

import { Request, Response, NextFunction } from 'express'
import barionIPs from './barionIPs';

export default async function (req: Request, res: Response, next: NextFunction) {
        
    if (barionIPs.indexOf(req.ip) === -1) {
        return res.sendStatus(403);
    }

    return next();

}
