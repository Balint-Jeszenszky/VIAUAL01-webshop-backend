import createTestEnv from '../createTestEnv';
createTestEnv();

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import User from '../../models/User';
import Product from '../../models/Product';
import app from '../../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

describe('Update cart', () => {
    let token: string;
    let userId: string;
    let productId: string;
    const user = new User();

    before(async () => {
        const product = new Product();
        product.name = 'prod';
        product.description = 'asda';
        product.stock = 3;
        product.price = 3;
        await product.save();
        productId = product._id;

        user.name= 'mockuser';
        user.username = 'uname';
        user.email = 'example@example.org';
        user.password = 'pass';
        user.cart = [{
            id: productId,
            amount: 2
        }]
        await user.save();

        userId = user._id;
        token = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET!);
    });

    beforeEach(async () => {
        user.cart[0].amount = 2;
        user.isModified('cart');
        await user.save();
    });

    after(async () => {
        await User.deleteMany({});
        await Product.deleteMany({});
    });

    it('should be successful with bigger amount', (done: Done) => {
        request(app).put(`/api/cart/${userId}`)
        .auth(token, { type: 'bearer' })
        .send([{id: productId, amount: 3}])
        .then(async res => {
            expect(res.status).to.be.equal(204);
            expect((await User.findById(userId))?.cart[0].amount).to.be.equal(3);
            done();
        }).catch(err=>done(err));
    });

    it('should be successful with smaller amount', (done: Done) => {
        request(app).put(`/api/cart/${userId}`)
        .auth(token, { type: 'bearer' })
        .send([{id: productId, amount: 1}])
        .then(async res => {
            expect(res.status).to.be.equal(204);
            expect((await User.findById(userId))?.cart[0].amount).to.be.equal(1);
            done();
        }).catch(err=>done(err));
    });

    it('should fail with bigger amount than the stock', (done: Done) => {
        request(app).put(`/api/cart/${userId}`)
        .auth(token, { type: 'bearer' })
        .send([{id: productId, amount: 4}])
        .then(res => {
            expect(res.status).to.be.equal(400);
            expect(user.cart[0].amount).to.be.equal(2);
            done();
        }).catch(err=>done(err));
    });

    it('should remove item from cart if the amount is less than 1', (done: Done) => {
        request(app).put(`/api/cart/${userId}`)
        .auth(token, { type: 'bearer' })
        .send([{id: productId, amount: 0}])
        .then(async res => {
            expect(res.status).to.be.equal(204);
            expect((await User.findById(userId))?.cart.length).to.be.equal(0);
            done();
        }).catch(err=>done(err));
    });
});