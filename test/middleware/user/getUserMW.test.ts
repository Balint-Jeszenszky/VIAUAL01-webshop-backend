process.env.NODE_ENV = 'test';

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import User from '../../../models/User';
import app from '../../../app';
import request from 'supertest';

describe('getUser middleware', () => {
    let id = '';

    before(async () => {
        const user = new User();
        user.name= 'User';
        user.username = 'usrnm';
        user.email = 'example@example.com';
        user.password = 'pass';
        await user.save();
        id = user._id;
    })

    it('should response with a user', (done: Done) => {
        request(app).get(`/api/user/${id}`)
        .then(res => {
            expect(res.status).to.be.equal(200);
            expect(res.body.username).to.be.equal('usrnm');
            expect(res.body.password).to.be.undefined;
            done();
        }).catch(err=>done(err));
    });

    it('should response with a 404 not found', (done: Done) => {
        request(app).get(`/api/user/123456781234567812345678`)
        .then(res => {
            expect(res.status).to.be.equal(404);
            done();
        }).catch(err=>done(err));
    });
});

