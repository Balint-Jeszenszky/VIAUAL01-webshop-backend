import createTestEnv from '../createTestEnv';
createTestEnv();

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import Product from '../../models/Product';
import app from '../../app';
import request from 'supertest';

describe('getProduct middleware', () => {
    let id = '';

    before(async () => {
        const product = new Product();
        product.name='eee';
        product.description = 'd';
        product.price = 222;
        await product.save();
        id = product._id;
    });

    after(async () => {
        await Product.deleteMany({});
    });

    it('should response with a product', (done: Done) => {
        request(app).get(`/api/product/${id}`)
        .then(res => {
            expect(res.status).to.be.equal(200);
            expect(res.body.name).to.be.equal('eee');
            expect(res.body.description).to.be.equal('d');
            done();
        }).catch(err=>done(err));
    });

    it('should response with a 404 not found', (done: Done) => {
        request(app).get(`/api/product/123456781234567812345678`)
        .then(res => {
            expect(res.status).to.be.equal(404);
            done();
        }).catch(err=>done(err));
    });
});
