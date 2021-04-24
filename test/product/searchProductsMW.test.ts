import createTestEnv from '../createTestEnv';
createTestEnv();

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import Product from '../../models/Product';
import app from '../../app';
import request from 'supertest';

describe('searchProducts middleware', () => {
    before(async () => {
        const product1 = new Product();
        product1.name='alma fa';
        product1.description = 'adfda';
        product1.price = 222;
        await product1.save();
        const product2 = new Product();
        product2.name='valami mas';
        product2.description = 'asdfadsdf';
        product2.price = 44;
        await product2.save();
        const product3 = new Product();
        product3.name='az';
        product3.description = 'ez is alma';
        product3.price = 44;
        await product3.save();
    });

    after(async () => {
        await Product.deleteMany({});
    });

    it('should response with a JSON array of products with matching name or description', (done: Done) =>{
        request(app).get('/api/products/search/alma/page/1')
        .then(res => {
            expect(res.status).to.be.equal(200);
            expect(res.body.length).to.be.equal(2);
            expect(res.body[0].name + res.body[0].description).to.contain('alma');
            expect(res.body[1].name + res.body[1].description).to.contain('alma');
            done();
        }).catch(err=>done(err));
    });
});
