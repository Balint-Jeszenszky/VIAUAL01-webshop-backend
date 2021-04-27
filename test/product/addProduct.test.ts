import createTestEnv from '../createTestEnv';
createTestEnv();

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import app from '../../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

describe('add product', () => {
    let userToken: string;

    before(async () => {
        const user = new User();
        user.name= 'mockuser';
        user.username = 'uname';
        user.email = 'example@example.org';
        user.password = 'pass';
        user.role = 'USER';
        await user.save();
        
        userToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET!);
    });

    after(async () => {
        await User.deleteMany({});
    });

    it('should response with 403 forbidden if user creates it', (done: Done) => {
        request(app).post('/api/category')
        .auth(userToken, { type: 'bearer' })
        .then(res => {
            expect(res.status).to.be.equal(403);
            done();
        }).catch(err=>done(err));
    });
});
