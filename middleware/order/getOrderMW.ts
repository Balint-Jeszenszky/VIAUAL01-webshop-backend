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
        res.json({
            id: '0',
            products: [{
                product: {
                    id: '0', name :'ceruza', description: 'grafit', imageURL: '640x480.png', categoryID: '1', price: {HUF: 85, EUR: 0.229, USD: 0.274}, stock: 100, recommended: true},
                    amount: 3
                }, {
                product: {
                    id: '1', name :'toll', description: 'kék'+req.params.categoryID, imageURL: '640x480.png', categoryID: '0', price: {HUF: 170, EUR: 0.458, USD: 0.548}, stock: 100, recommended: true},
                    amount: 2
                }
            ], 
            date: new Date(),
            mapsAPI: {
                APIKey: process.env.MAPS_API_KEY,
                coords: { lat: 47.4733, lng: 19.05898 }
            }
        });
    };
}
