import createTestEnv from '../createTestEnv';
createTestEnv();

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import app from '../../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../../models/User';

describe('delete User', () => {
    let userToken: string;
    let user: IUser;
    let user2: IUser;

    beforeEach(async () => {
        user = new User();
        user.name= 'mockuser';
        user.username = 'uname';
        user.email = 'example@example.org';
        user.password = 'pass';
        user.role = 'USER';
        await user.save();

        user2 = new User();
        user2.name= 'mockuser';
        user2.username = 'asd';
        user2.email = 'example@asd.org';
        user2.password = 'pass';
        user2.role = 'USER';
        await user2.save();

        userToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET!);
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    it('should response with 204 no content if logged in user deletes it', (done: Done) => {
        request(app).delete(`/api/user/${user._id}`)
        .auth(userToken, { type: 'bearer' })
        .then(res => {
            expect(res.status).to.be.equal(204);
            done();
        }).catch(err=>done(err));
    });

    it('should response with 403 forbidden if other user deletes it', (done: Done) => {
        request(app).delete(`/api/user/${user2._id}`)
        .auth(userToken, { type: 'bearer' })
        .then(res => {
            expect(res.status).to.be.equal(403);
            done();
        }).catch(err=>done(err));
    });

    it('should response with 401 unauthorized if logged out user deletes it', (done: Done) => {
        request(app).delete(`/api/user/${user._id}`)
        .then(res => {
            expect(res.status).to.be.equal(401);
            done();
        }).catch(err=>done(err));
    });
});
