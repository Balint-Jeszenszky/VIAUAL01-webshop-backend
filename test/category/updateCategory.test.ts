import createTestEnv from '../createTestEnv';
createTestEnv();

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import Category, { ICategory } from '../../models/Category';
import app from '../../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

describe('delete category', () => {
    let adminToken: string;
    let userToken: string;
    let cat: ICategory;

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
        cat = new Category();
        cat.name='asd';
        cat.productNumber = 7;
        await cat.save();
    });

    afterEach(async () => {
        await Category.deleteMany({});
    });

    after(async () => {
        await User.deleteMany({});
    });

    it('should response with 204 no content if admin updates it', (done: Done) => {
        request(app).delete(`/api/category/${cat._id}`)
        .auth(adminToken, { type: 'bearer' })
        .send({id: cat._id, name: 'aaaa'})
        .then(res => {
            expect(res.status).to.be.equal(204);
            done();
        }).catch(err=>done(err));
    });

    it('should response with 403 forbidden if user updates it', (done: Done) => {
        request(app).delete(`/api/category/${cat._id}`)
        .auth(userToken, { type: 'bearer' })
        .send({id: cat._id, name: 'aaaa'})
        .then(res => {
            expect(res.status).to.be.equal(403);
            done();
        }).catch(err=>done(err));
    });

    it('should response with 404 not found if not exists', (done: Done) => {
        request(app).delete(`/api/category/123456781234567812345678`)
        .auth(adminToken, { type: 'bearer' })
        .send({id: '123456781234567812345678', name: 'aaaa'})
        .then(res => {
            expect(res.status).to.be.equal(404);
            done();
        }).catch(err=>done(err));
    });
});
