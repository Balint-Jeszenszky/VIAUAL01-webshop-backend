import createTestEnv from '../createTestEnv';
createTestEnv();

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import User from '../../models/User';
import Product from '../../models/Product';
import app from '../../app';
import request from 'supertest';
import jwt, {  } from 'jsonwebtoken';

describe('Add product to cart', () => {
    let token: string;
    let userId: string;
    let productId: string;

    before(async () => {
        const user = new User();
        user.name= 'mockuser';
        user.username = 'uname';
        user.email = 'example@example.org';
        user.password = 'pass';
        user.cart = []
        await user.save();

        userId = user._id;
        token = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET!);
    });

    beforeEach(async () => {
        const product = new Product();
        product.name = 'prod';
        product.description = 'asda';
        product.stock = 3;
        product.price = 3;
        await product.save();
        productId = product._id;
    });

    after(async () => {
        await User.deleteMany({});
    });

    afterEach(async () => {
        await Product.deleteMany({});
    });

    it('should be successful with less product than stock', (done: Done) => {
        request(app).post(`/api/cart/${userId}`)
        .auth(token, { type: 'bearer' })
        .send({productId, amount: 2})
        .then(res => {
            expect(res.status).to.be.equal(201);
            done();
        }).catch(err=>done(err));
    });

    it('should be successful with same amount of product and stock', (done: Done) => {
        request(app).post(`/api/cart/${userId}`)
        .auth(token, { type: 'bearer' })
        .send({productId, amount: 3})
        .then(res => {
            expect(res.status).to.be.equal(201);
            done();
        }).catch(err=>done(err));
    });

    it('should with bigger amount than the stock', (done: Done) => {
        request(app).post(`/api/cart/${userId}`)
        .auth(token, { type: 'bearer' })
        .send({productId, amount: 4})
        .then(res => {
            expect(res.status).to.be.equal(400);
            done();
        }).catch(err=>done(err));
    });
});