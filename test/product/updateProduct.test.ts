import createTestEnv from '../createTestEnv';
createTestEnv();

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import Category, { ICategory } from '../../models/Category';
import app from '../../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import Product from '../../models/Product';

describe('update Product', () => {
    let adminToken: string;
    let userToken: string;
    const product = new Product();

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

        product.name = 'asdas';
        product.description = 'asdf';
        product.categoryID = '123456781234567812345678';
        product.price = 55;
        product.stock = 2;
        product.recommended = false;
        await product.save();

        adminToken = jwt.sign({userId: admin._id}, process.env.ACCESS_TOKEN_SECRET!);
        userToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET!);
    });

    after(async () => {
        await User.deleteMany({});
        await Product.deleteMany({});
    });

    it('should response with 204 no content if admin updates it', (done: Done) => {
        request(app).put(`/api/product/${product._id}`)
        .auth(adminToken, { type: 'bearer' })
        .send({id: product._id, name: 'newName', description: 'newDesc', categoryID: '123456781234567812345678', price: 88, stock: 25, recommended: 'true'})
        .then(async res => {
            expect(res.status).to.be.equal(204);
            const p = await Product.findById(product._id);
            expect(p?.name).to.be.equal('newName');
            expect(p?.description).to.be.equal('newDesc');
            expect(p?.price).to.be.equal(88);
            expect(p?.stock).to.be.equal(25);
            expect(p?.recommended).to.be.equal(true);
            done();
        }).catch(err=>done(err));
    });

    it('should response with 403 forbidden if user updates it', (done: Done) => {
        request(app).put(`/api/product/${product._id}`)
        .auth(userToken, { type: 'bearer' })
        .send({id: product._id, name: 'newName', description: 'newDesc', categoryID: '123456781234567812345678', price: 88, stock: 25, recommended: 'true'})
        .then(res => {
            expect(res.status).to.be.equal(403);
            done();
        }).catch(err=>done(err));
    });

    it('should response with 404 not found if not exists', (done: Done) => {
        request(app).put(`/api/product/123456781234567812345678`)
        .auth(adminToken, { type: 'bearer' })
        .send({id: '123456781234567812345678', name: 'newName', description: 'newDesc', categoryID: '123456781234567812345678', price: 88, stock: 25, recommended: 'true'})
        .then(res => {
            expect(res.status).to.be.equal(404);
            done();
        }).catch(err=>done(err));
    });
});
