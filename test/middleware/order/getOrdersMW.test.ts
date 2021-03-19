// process.env.NODE_ENV = 'test';

// import { expect } from 'chai';
// import { describe, it, before, Done } from 'mocha';
// import Product from '../../../models/Product';
// import Order from '../../../models/Order';
// import app from '../../../app';
// import request from 'supertest';

// describe('getOrders middleware', () => {
//     before(async () => {
//         const order = new Order();
//         order.date = new Date();
//         order.products = [{productID: 'asd', amount: 3}];
//         await order.save();
//     });

//     it('should response with a JSON array of orders if the user is admin', (done: Done) => {
//         request(app).get(`/api/orders`)
//         .then(res => {
//             expect(res.status).to.be.equal(200);
//             expect(res.body.length).to.be.equal(1);
//             done();
//         }).catch(err => done(err));
//     });

//     it('should response with 403 if the user is not admin', (done: Done) => {
//         request(app).get(`/api/`)
//         .then(res => {
//             expect(res.status).to.be.equal(403);
//             done();
//         }).catch(err => done(err));
//     });
// });
