import express from 'express';

import authMW from '../middleware/auth/authMW';
import checkLoginMW from '../middleware/auth/checkLoginMW';
import checkRegMW from '../middleware/auth/checkRegMW';
import saveUserMW from '../middleware/auth/saveUserMW';

import getBasketMW from '../middleware/basket/getBasketMW';
import updateBasketMW from '../middleware/basket/updateBasketMW';

import getCurrenciesMW from '../middleware/currencies/getCurrenciesMW';
import updateCurrenciesMW from '../middleware/currencies/updateCurrenciesMW';

import updateDeliveryMW from '../middleware/delivery/updateDeliveryMW'

import getOrderMW from '../middleware/order/getOrderMW';
import updateOrderMW from '../middleware/order/updateOrderMW';

import checkProductMW from '../middleware/product/checkProductMW';
import deleteProductMW from '../middleware/product/deleteProductMW';
import getProductMW from '../middleware/product/getProductMW';
import getProductsMW from '../middleware/product/getProductsMW';
import getRecommendedProductsMW from '../middleware/product/getRecommendedProductsMW';
import saveProductMW from '../middleware/product/saveProductMW';
import searchProductsMW from '../middleware/product/searchProductsMW';
import updateProductMW from '../middleware/product/updateProductMW';

import subscribeMW from '../middleware/subscribe/subscribeMW'

import checkUserDataMW from '../middleware/user/checkUserDataMW';
import deleteUserMW from '../middleware/user/deleteUserMW';
import getUserMW from '../middleware/user/getUserMW';
import updateUserMW from '../middleware/user/updateUserMW';

import ObjectRepository from '../models/ObjectRepository';
import Product from '../models/Product';

export default function(app: express.Application) {

    const objRepo: ObjectRepository = {
        Product
    }

    app.post(
        '/api/auth/register',
        checkRegMW(objRepo),
	    saveUserMW(objRepo)
    );

    app.post(
        '/api/auth/login',
        checkLoginMW(objRepo)
    );

    app.get(
        '/api/basket/:userID',
        authMW(objRepo),
        getBasketMW(objRepo)
    );

    app.put(
        '/api/basket/:userID',
        authMW(objRepo),
        updateBasketMW(objRepo)
    );

    app.get(
        '/api/currencies',
        authMW(objRepo),
        getCurrenciesMW(objRepo)
    );

    app.put(
        '/api/currencies',
        authMW(objRepo),
        updateCurrenciesMW(objRepo)
    );

    app.put(
        '/api/delivery/:companyID',
        authMW(objRepo),
        updateDeliveryMW(objRepo)
    );

    app.get(
        '/api/orders/:orderID',
        authMW(objRepo),
        getOrderMW(objRepo)
    );

    app.put(
        '/api/orders/:orderID',
        authMW(objRepo),
        updateOrderMW(objRepo)
    );

    app.get(
        '/api/product/:productID',
        getProductMW(objRepo)
    );

    app.post(
        '/api/product/:productID',
        authMW(objRepo),
        checkProductMW(objRepo),
        saveProductMW(objRepo)
    );

    app.put(
        '/api/product/:productID',
       authMW(objRepo),
       checkProductMW(objRepo),
       updateProductMW(objRepo)
    );

    app.delete(
        '/api/product/:productID',
        authMW(objRepo),
        deleteProductMW(objRepo)
    );

    app.get(
        '/api/profile/:userID',
        authMW(objRepo),
        getUserMW(objRepo)
    );

    app.put(
        '/api/profile/:userID',
        authMW(objRepo),
        checkUserDataMW(objRepo),
        updateUserMW(objRepo)
    );

    app.delete(
        '/api/profile/:userID',
        authMW(objRepo),
        deleteUserMW(objRepo)
    );

    app.get(
        '/api/products/:categoryID/page/:page',
        getProductsMW(objRepo)
    );

    app.get(
        '/api/products',
        getRecommendedProductsMW(objRepo)
    );

    app.post(
        '/api/products/search',
        searchProductsMW(objRepo)
    );

    app.post(
        '/api/subscribe',
        authMW(objRepo),
        subscribeMW(objRepo)
    );

}
