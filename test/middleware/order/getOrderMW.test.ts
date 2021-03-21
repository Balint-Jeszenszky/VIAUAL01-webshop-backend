process.env.NODE_ENV = 'test';

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import Order from '../../../models/Order';
import app from '../../../app';
import request from 'supertest';
import Product from '../../../models/Product';

describe('getOrder middleware', () => {
    let id = '';

    before(async () => {
        const product = new Product();
        product.name = 'foo';
        product.description = 'bar';
        product.price = 89;
        await product.save();
        const order = new Order();
        order.date = new Date();
        order.products = [{id: product._id, amount: 3}];
        await order.save();
        id = order._id;
    });

    it('should response with an order', (done: Done) => {
        request(app).get(`/api/order/${id}`)
        .then(res => {
            expect(res.status).to.be.equal(200);
            expect(res.body.products.length).to.be.equal(1);
            expect(res.body.products[0].amount).to.be.equal(3);
            done();
        }).catch(err=>done(err));
    });

    it('should response with a 404 not found', (done: Done) => {
        request(app).get(`/api/product/123456781234567812345678`)
        .then(res => {
            expect(res.status).to.be.equal(404);
            done();
        }).catch(err=>done(err));
    });
});
