process.env.NODE_ENV = 'test';

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import User from '../../../models/User';
import app from '../../../app';
import request from 'supertest';

describe('POST new user', () => {
    before(async () => {
        const user = new User();
        user.name= 'mockuser';
        user.username = 'uname';
        user.email = 'example@example.org';
        user.password = 'pass';
        await user.save();
    });

    it('should response username already registered error', (done: Done) => {
        request(app).post('/api/auth/register')
        .send({name: 'asd', username: 'uname', email: 'mail@mail.mail', password: 'aaaaaaaa'})
        .then(res => {
            expect(res.status).to.be.equal(409);
            expect(res.body.errors.length).to.be.equal(1);
            expect(res.body.errors[0]).to.be.equal('username');
            done();
        }).catch(err=>done(err));
    });

    it('should response email already registered error', (done: Done) => {
        request(app).post('/api/auth/register')
        .send({name: 'asd', username: 'username', email: 'example@example.org', password: 'aaaaaaaa'})
        .then(res => {
            expect(res.status).to.be.equal(409);
            expect(res.body.errors.length).to.be.equal(1);
            expect(res.body.errors[0]).to.be.equal('email_reg');
            done();
        }).catch(err=>done(err));
    });

    it('should response email iinvalid error', (done: Done) => {
        request(app).post('/api/auth/register')
        .send({name: 'asd', username: 'username', email: 'mail', password: 'aaaaaaaa'})
        .then(res => {
            expect(res.status).to.be.equal(409);
            expect(res.body.errors.length).to.be.equal(1);
            expect(res.body.errors[0]).to.be.equal('email_invalid');
            done();
        }).catch(err=>done(err));
    });

    it('should response short password error', (done: Done) => {
        request(app).post('/api/auth/register')
        .send({name: 'asd', username: 'username', email: 'mail@mail.mail', password: 'aaaaaaa'})
        .then(res => {
            expect(res.status).to.be.equal(409);
            expect(res.body.errors.length).to.be.equal(1);
            expect(res.body.errors[0]).to.be.equal('pass_short');
            done();
        }).catch(err=>done(err));
    });

    it('should response 201 created', (done: Done) => {
        request(app).post('/api/auth/register')
        .send({name: 'asd', username: 'username', email: 'mail@mail.mail', password: 'aaaaaaaa'})
        .then(res => {
            expect(res.status).to.be.equal(201);
            expect(res.body.errors).to.be.undefined;
            done();
        }).catch(err=>done(err));
    });
});

