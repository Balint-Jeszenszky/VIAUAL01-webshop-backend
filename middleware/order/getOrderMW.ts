/**
 * get the order details
 * orderid set on req.params.orderID
 */

import { Request, Response, NextFunction } from 'express';
import requireOption from '../generic/requireOption';
import ObjectRepository from '../../models/ObjectRepository';
import { Model } from 'mongoose';
import { IOrder, toOrderDTO } from '../../models/Order';
import { IProduct, toProductDTO } from '../../models/Product';

export default function(objRepo: ObjectRepository) {
    const OrerModel: Model<IOrder> = requireOption(objRepo, 'Order');
    const ProductModel: Model<IProduct> = requireOption(objRepo, 'Product');

    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const order = await OrerModel.findOne({ _id: req.params.orderID });
            if (order) {
                const products = [];
                for (const prod of order.products) {
                    const product = await ProductModel.findOne({ _id: prod.id });
                    if (product) products.push({product: toProductDTO(product, res.locals.currencies), amount: prod.amount});
                }
                res.json(toOrderDTO(Object.assign(order, {products})));
            } else {
                res.sendStatus(404);
            }
        } catch(e) {
            next(e);
        }
    };
}
