import express from 'express';

import getRecommendedProductsMW from '../middleware/product/getRecommendedProductsMW';

import ObjectRepository from '../models/ObjectRepository';
import Product from '../models/Product';

export default function(app: express.Application) {

    const objRepo: ObjectRepository = {
        Product
    }

    app.post(
        '/api/auth/register',
        (req, res, next) => {res.send('POST /api/auth/register');}
    );

    app.post(
        '/api/auth/login',
        (req, res, next) => {res.send('POST /api/auth/login');}
    );

    app.get(
        '/api/basket/:userID',
        (req, res, next) => {res.send('GET /api/basket/:userID');}
    );

    app.put(
        '/api/basket/:userID',
        (req, res, next) => {res.send('PUT /api/basket/:userID');}
    );

    app.get(
        '/api/currencies',
        (req, res, next) => {res.send('GET /api/currencies');}
    );

    app.put(
        '/api/currencies',
        (req, res, next) => {res.send('PUT /api/currencies');}
    );

    app.put(
        '/api/delivery/:companyID',
        (req, res, next) => {res.send('PUT /api/delivery/:companyID');}
    );

    app.get(
        '/api/orders/:orderID',
        (req, res, next) => {res.send('GET /api/orders/:orderID');}
    );

    app.put(
        '/api/orders/:orderID',
        (req, res, next) => {res.send('PUT /api/orders/:orderID');}
    );

    app.get(
        '/api/product/:productID',
        (req, res, next) => {res.send('GET /api/product/:productID');}
    );

    app.post(
        '/api/product/:productID',
        (req, res, next) => {res.send('POST /api/product/:productID');}
    );

    app.put(
        '/api/product/:productID',
        (req, res, next) => {res.send('PUT /api/product/:productID');}
    );

    app.delete(
        '/api/product/:productID',
        (req, res, next) => {res.send('DELETE /api/product/:productID');}
    );

    app.get(
        '/api/profile/:userID',
        (req, res, next) => {res.send('GET /api/profile/:userID');}
    );

    app.put(
        '/api/profile/:userID',
        (req, res, next) => {res.send('PUT /api/profile/:userID');}
    );

    app.delete(
        '/api/profile/:userID',
        (req, res, next) => {res.send('DELETE /api/profile/:userID');}
    );

    app.get(
        '/api/products/:categoryID/page/:page',
        (req, res, next) => {res.send('GET /api/products/:categoryID/page/:page');}
    );

    app.get(
        '/api/products',
        getRecommendedProductsMW(objRepo)
    );

    app.post(
        '/api/products/search',
        (req, res, next) => {res.send('POST /api/products/search');}
    );

    app.post(
        '/api/subscribe',
        (req, res, next) => {res.send('POST /api/subscribe');}
    );

}