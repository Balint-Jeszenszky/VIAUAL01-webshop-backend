import createTestEnv from '../createTestEnv';
createTestEnv();

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import Category from '../../models/Category';
import app from '../../app';
import request from 'supertest';

describe('getCategories middleware', () => {
    before(async () => {
        const cat1 = new Category();
        cat1.name='asd';
        cat1.productNumber = 7;
        await cat1.save();
        const cat2 = new Category();
        cat2.name='rrr';
        cat2.productNumber = 72;
        await cat2.save();
    })

    after(async () => {
        await Category.deleteMany({});
    });

    it('should response with a JSON array of all categories', (done: Done) => {
        request(app).get('/api/categories')
        .then(res => {
            expect(res.status).to.be.equal(200);
            expect(res.body.length).to.be.equal(2);
            expect(res.body[0].name).to.be.equal('asd');
            expect(res.body[1].name).to.be.equal('rrr');
            done();
        }).catch(err=>done(err));
    });
});
