process.env.NODE_ENV = 'test';

import { expect } from 'chai';
import { describe, it, before, Done } from 'mocha';
import Product from '../../../models/Product';
import Category from '../../../models/Category';
import app from '../../../app';
import request from 'supertest';

describe('getProducts middleware', () => {
    let id = '';
    before(async () => {
        const cat = new Category();
        cat.name = 'cccc';
        cat.productNumber = 5;
        await cat.save();
        id = cat._id;
        const product1 = new Product();
        product1.name='asdasd';
        product1.description = 'dd';
        product1.price = 2222;
        product1.categoryID = id;
        await product1.save();
        const product2 = new Product();
        product2.name='rrrr';
        product2.description = 'ewwwf';
        product2.price = 444;
        await product2.save();
    });

    it('should response with a JSON array of products', (done: Done) => {
        request(app).get(`/api/products/${id}/page/1`)
        .then(res => {
            expect(res.status).to.be.equal(200);
            expect(res.body.length).to.be.equal(1);
            expect(res.body[0].name).to.be.equal('asdasd');
            done();
        }).catch(err => done(err));
    });

    it('should response with 400 bad request', (done: Done) => {
        request(app).get(`/api/products/${id}/page/asd`)
        .then(res => {
            expect(res.status).to.be.equal(400);
            done();
        }).catch(err => done(err));
    });
});
