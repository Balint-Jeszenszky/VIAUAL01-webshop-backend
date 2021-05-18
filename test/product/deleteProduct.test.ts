import createTestEnv from '../createTestEnv';
createTestEnv();

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import app from '../../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import Product, { IProduct } from '../../models/Product';

describe('delete product', () => {
    let adminToken: string;
    let userToken: string;
    let product: IProduct;

    before(async () => {
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

        adminToken = jwt.sign({userId: admin._id}, process.env.ACCESS_TOKEN_SECRET!);
        userToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET!);
    });

    beforeEach(async () => {
        product = new Product();
        product.name='asd';
        product.description = 'asdasd';
        product.price = 44;
        await product.save();
    });

    afterEach(async () => {
        await Product.deleteMany({});
    });

    after(async () => {
        await User.deleteMany({});
    });

    it('should response with 204 no content if admin deletes it', (done: Done) => {
        request(app).delete(`/api/product/${product._id}`)
        .auth(adminToken, { type: 'bearer' })
        .then(res => {
            expect(res.status).to.be.equal(204);
            done();
        }).catch(err=>done(err));
    });

    it('should response with 403 forbidden if user deletes it', (done: Done) => {
        request(app).delete(`/api/product/${product._id}`)
        .auth(userToken, { type: 'bearer' })
        .then(res => {
            expect(res.status).to.be.equal(403);
            done();
        }).catch(err=>done(err));
    });

    it('should response with 404 not found if not exists', (done: Done) => {
        request(app).delete(`/api/product/123456781234567812345678`)
        .auth(adminToken, { type: 'bearer' })
        .then(res => {
            expect(res.status).to.be.equal(404);
            done();
        }).catch(err=>done(err));
    });
});
