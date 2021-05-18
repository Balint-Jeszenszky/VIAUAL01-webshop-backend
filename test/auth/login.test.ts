import createTestEnv from '../createTestEnv';
createTestEnv();

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import User from '../../models/User';
import app from '../../app';
import request from 'supertest';
import bcrypt from 'bcrypt';

describe('User login', () => {
    before(async () => {
        const user = new User();
        user.name= 'mockuser';
        user.username = 'uname';
        user.email = 'example@example.org';
        user.password = await bcrypt.hash('password', 10);
        await user.save();
    });

    after(async () => {
        await User.deleteMany({});
    });

    it('should should be successful with correct credentials', (done: Done) => {
        request(app).post('/api/auth/login')
        .send({username: 'uname', password: 'password'})
        .then(res => {
            expect(res.status).to.be.equal(200);
            expect(res.body.accessToken).to.be.not.null;
            expect(res.body.refreshToken).to.be.not.null;
            done();
        }).catch(err=>done(err));
    });

    it('should should fail with wrong credentials', (done: Done) => {
        request(app).post('/api/auth/login')
        .send({username: 'uname', password: 'pw'})
        .then(res => {
            expect(res.status).to.be.equal(403);
            done();
        }).catch(err=>done(err));
    });
});
