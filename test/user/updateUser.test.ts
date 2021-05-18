import createTestEnv from '../createTestEnv';
createTestEnv();

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import User from '../../models/User';
import app from '../../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

describe('update user details', () => {
    let id = '';
    let token = '';

    before(async () => {
        const user = new User();
        user.name= 'User';
        user.username = 'usrnm';
        user.email = 'example@example.com';
        user.password = await bcrypt.hash('pass', 10);
        await user.save();
        
        const otherUser = new User();
        otherUser.name= 'User';
        otherUser.username = 'asd';
        otherUser.email = 'example@asd.com';
        otherUser.password = 'pass';
        await otherUser.save();

        id = user._id;
        token = jwt.sign({userId: id}, process.env.ACCESS_TOKEN_SECRET!);
    });

    after(async () => {
        await User.deleteMany({});
    });

    it('should fail with invalid email', (done: Done) => {
        request(app).put(`/api/user/${id}`)
        .auth(token, { type: 'bearer' })
        .send({userId: id, name: 'User', email: 'asdasd'})
        .then(res => {
            expect(res.status).to.be.equal(400);
            expect(res.body.errors.find((e: string) => e === 'email_invalid')).not.to.be.equal(-1);
            done();
        }).catch(err=>done(err));
    });

    it('should fail with registered email', (done: Done) => {
        request(app).put(`/api/user/${id}`)
        .auth(token, { type: 'bearer' })
        .send({userId: id, name: 'User', email: 'example@asd.com'})
        .then(res => {
            expect(res.status).to.be.equal(400);
            expect(res.body.errors.find((e: string) => e === 'email_reg')).not.to.be.equal(-1);
            done();
        }).catch(err=>done(err));
    });

    it('should fail with not matching new password', (done: Done) => {
        request(app).put(`/api/user/${id}`)
        .auth(token, { type: 'bearer' })
        .send({
            userId: id, 
            name: 'User', 
            email: 'example@example.com',
            oldPassword: 'pass',
            newPassword: '12345678',
            confirmPassword: '11111111'
        })
        .then(res => {
            expect(res.status).to.be.equal(400);
            expect(res.body.errors.find((e: string) => e === 'pass_not_match')).not.to.be.equal(-1);
            done();
        }).catch(err=>done(err));
    });
    
    it('should be successful with correct details', (done: Done) => {
        request(app).put(`/api/user/${id}`)
        .auth(token, { type: 'bearer' })
        .send({userId: id, name: 'User', email: 'example@example.com'})
        .then(res => {
            expect(res.status).to.be.equal(204);
            done();
        }).catch(err=>done(err));
    });
    
    it('should be successful with correct new password', (done: Done) => {
        request(app).put(`/api/user/${id}`)
        .auth(token, { type: 'bearer' })
        .send({
            userId: id, 
            name: 'User', 
            email: 'example@example.com',
            oldPassword: 'pass',
            newPassword: '12345678',
            confirmPassword: '12345678'
        })
        .then(res => {
            expect(res.status).to.be.equal(204);
            done();
        }).catch(err=>done(err));
    });
});

