process.env.NODE_ENV = 'test';

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import Product from '../../../models/Product';
import app from '../../../app';
import request from 'supertest';

describe('getRecommendedProducts middleware', () => {
    before(async () => {
        const product1 = new Product();
        product1.name='asd';
        product1.description = 'd';
        product1.price = {'HUF': 222};
        product1.recommended = true;
        await product1.save();
        const product2 = new Product();
        product2.name='rrr';
        product2.description = 'ewwf';
        product2.price = {'HUF': 44};
        product2.recommended = false;
        await product2.save();
    })

    it('should response with a JSON array of recommended products', (done: Done) =>{
        request(app).get('/api/products')
        .then(res => {
            expect(res.status).to.be.equal(200);
            expect(res.body.length).to.be.equal(1);
            expect(res.body[0].name).to.be.equal('asd');
            done();
        }).catch(err=>done(err));
    });
});
