/**
 * Gets all products from the database
 * Responds with a json array of products
 */

 import { Request, Response, NextFunction } from 'express';
 import requireOption from '../generic/requireOption';
 import ObjectRepository from '../../models/ObjectRepository';
 import { Model } from 'mongoose';
 import { IProduct, toProductDTO } from '../../models/Product';
 
 export default function(objRepo: ObjectRepository) {
     const ProductModel: Model<IProduct> = requireOption(objRepo, 'Product');
 
     return async function (req: Request, res: Response, next: NextFunction) {
         try {
             const products = await ProductModel.find({});
             res.json(products.map(e => {return {id: e._id, name: e.name };} ));
         } catch (e) {
             next(e);
         }
     };
 }
 