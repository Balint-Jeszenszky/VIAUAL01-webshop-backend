import createTestEnv from '../createTestEnv';
createTestEnv();

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import Order from '../../models/Order';
import app from '../../app';
import request from 'supertest';
import Product from '../../models/Product';
import User from '../../models/User';
import jwt from 'jsonwebtoken';

describe('get Order', () => {
    let id = '';
    let token = '';

    before(async () => {
        const product = new Product();
        product.name = 'foo';
        product.description = 'bar';
        product.price = 89;
        await product.save();
        const user = new User();
        user.name = 'asd';
        user.username = 'asd';
        user.email = 'asd';
        user.password = 'asd';
        user.refreshToken = 'asd';
        await user.save();
        const order = new Order();
        order.date = new Date();
        order.products = [{id: product._id, amount: 3}];
        order.paid = true;
        order.currency = 'HUF';
        order.customer = {
            name: 'asd',
            address: 'asd',
            email: 'asdas@asd.asd',
            phoneNumber: '+36201234567',
            userId: user._id
        }
        await order.save();
        id = order._id;
        token = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET!);
    });

    after(async () => {
        await Product.deleteMany({});
        await Order.deleteMany({});
        await User.deleteMany({});
    })

    it('should response with an order', (done: Done) => {
        request(app).get(`/api/order/${id}`)
        .auth(token, { type: 'bearer' })
        .then(res => {
            expect(res.status).to.be.equal(200);
            expect(res.body.products.length).to.be.equal(1);
            expect(res.body.products[0].amount).to.be.equal(3);
            done();
        }).catch(err=>done(err));
    });

    it('should response with a 404 not found', (done: Done) => {
        request(app).get(`/api/product/123456781234567812345678`)
        .auth(token, { type: 'bearer' })
        .then(res => {
            expect(res.status).to.be.equal(404);
            done();
        }).catch(err=>done(err));
    });
});
