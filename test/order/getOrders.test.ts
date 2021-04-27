process.env.NODE_ENV = 'test';

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import Product from '../../models/Product';
import Order from '../../models/Order';
import User from '../../models/User';
import app from '../../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

describe('getOrders middleware', () => {
    let adminToken: string;
    let userToken: string;

    before(async () => {
        const product = new Product();
        product.name='eee';
        product.description = 'd';
        product.price = 222;
        await product.save();
        
        const admin = new User();
        admin.name= 'mockuser';
        admin.username = 'admin';
        admin.email = 'admin@example.org';
        admin.password = 'pass';
        admin.role = 'ADMIN';
        await admin.save();

        const user = new User();
        user.name= 'mockuser';
        user.username = 'uname';
        user.email = 'example@example.org';
        user.password = 'pass';
        user.role = 'USER';
        await user.save();

        const order = new Order();
        order.date = new Date();
        order.products = [{id: product._id, amount: 3}];
        order.customer = {name: 'asd', email: 'asd', address: 'asd', phoneNumber: '321', userId: user._id};
        order.paid = true;
        await order.save();

        adminToken = jwt.sign({userId: admin._id}, process.env.ACCESS_TOKEN_SECRET!);
        userToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET!);
    });

    after(async () => {
        await User.deleteMany({});
    });

    it('should response with a JSON array of orders if the user is admin', (done: Done) => {
        request(app).get(`/api/orders`)
        .auth(adminToken, { type: 'bearer' })
        .then(res => {
            expect(res.status).to.be.equal(200);
            expect(res.body.length).to.be.equal(1);
            done();
        }).catch(err => done(err));
    });

    it('should response with 403 if the user is not admin', (done: Done) => {
        request(app).get(`/api/orders`)
        .auth(userToken, { type: 'bearer' })
        .then(res => {
            expect(res.status).to.be.equal(403);
            done();
        }).catch(err => done(err));
    });
});
