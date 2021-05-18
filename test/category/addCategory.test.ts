import createTestEnv from '../createTestEnv';
createTestEnv();

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import Category from '../../models/Category';
import app from '../../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

describe('add category', () => {
    let adminToken: string;
    let userToken: string;
    const cat = new Category();

    before(async () => {
        cat.name='asd';
        cat.productNumber = 7;
        await cat.save();
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

    after(async () => {
        await Category.deleteMany({});
        await User.deleteMany({});
    });

    it('should response with 201 created if admin creates it', (done: Done) => {
        request(app).post('/api/category')
        .auth(adminToken, { type: 'bearer' })
        .send({name: 'newCategory'})
        .then(res => {
            expect(res.status).to.be.equal(201);
            done();
        }).catch(err=>done(err));
    });

    it('should response with 403 forbidden if user creates it', (done: Done) => {
        request(app).post('/api/category')
        .auth(userToken, { type: 'bearer' })
        .send({name: 'newCategory'})
        .then(res => {
            expect(res.status).to.be.equal(403);
            done();
        }).catch(err=>done(err));
    });

    it('should response with 409 conflict if already exists', (done: Done) => {
        request(app).post('/api/category')
        .auth(adminToken, { type: 'bearer' })
        .send({name: 'asd'})
        .then(res => {
            expect(res.status).to.be.equal(409);
            done();
        }).catch(err=>done(err));
    });
});
