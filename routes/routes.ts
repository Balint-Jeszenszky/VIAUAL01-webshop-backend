import express from 'express';

import authMW from '../middleware/auth/authMW';
import checkLoginMW from '../middleware/auth/checkLoginMW';
import checkRegMW from '../middleware/auth/checkRegMW';
import saveUserMW from '../middleware/auth/saveUserMW';

import getCartMW from '../middleware/cart/getCartMW';
import updateCartMW from '../middleware/cart/updateCartMW';

import createCategoryMW from '../middleware/category/createCategoryMW';
import deleteCategoryMW from '../middleware/category/deleteCategoryMW';
import editCategoryMW from '../middleware/category/editCategoryMW';
import getCategoriesMW from '../middleware/category/getCategoriesMW';

import getAcceptedCurrenciesMW from '../middleware/currency/getAcceptedCurrenciesMW';
import getCurrenciesMW from '../middleware/currency/getCurrenciesMW';
import updateCurrenciesMW from '../middleware/currency/updateCurrenciesMW';

import updateDeliveryMW from '../middleware/delivery/updateDeliveryMW'

import createOrder from '../middleware/order/createOrderMW';
import getOrderMW from '../middleware/order/getOrderMW';
import getOrdersMW from '../middleware/order/getOrdersMW';
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
import Category from '../models/Category';
import User from '../models/User';
import Order from '../models/Order';
import Currency from '../models/Currency';

export default function(app: express.Application) {

    const objRepo: ObjectRepository = {
        Product,
        Category,
        User,
        Order,
        Currency
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
        '/api/cart/:userID',
        authMW(objRepo),
        getCurrenciesMW(objRepo),
        getCartMW(objRepo)
    );

    app.put(
        '/api/cart/:userID',
        authMW(objRepo),
        updateCartMW(objRepo)
    );

    app.get(
        '/api/currencies',
        authMW(objRepo),
        getCurrenciesMW(objRepo),
        getAcceptedCurrenciesMW(objRepo)
    );

    app.put(
        '/api/currencies',
        authMW(objRepo),
        updateCurrenciesMW(objRepo)
    );

    app.get(
        '/api/categories',
        getCategoriesMW(objRepo)
    );
    
    app.post(
        '/api/categories',
        authMW(objRepo),
        createCategoryMW(objRepo)
    );
    
    app.put(
        '/api/categories',
        authMW(objRepo),
        editCategoryMW(objRepo)
    );
    
    app.delete(
        '/api/categories',
        authMW(objRepo),
        deleteCategoryMW(objRepo)
    );

    app.put(
        '/api/delivery/:companyID',
        authMW(objRepo),
        updateDeliveryMW(objRepo)
    );

    app.get(
        '/api/order/:orderID',
        authMW(objRepo),
        getCurrenciesMW(objRepo),
        getOrderMW(objRepo)
    );

    app.post(
        '/api/order/:orderID',
        authMW(objRepo),
        createOrder(objRepo)
    );

    app.put(
        '/api/order/:orderID',
        authMW(objRepo),
        updateOrderMW(objRepo)
    );

    app.get(
        '/api/orders',
        authMW(objRepo),
        getOrdersMW(objRepo)
    );

    app.get(
        '/api/product/:productID',
        getCurrenciesMW(objRepo),
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
        '/api/user/:userID',
        authMW(objRepo),
        getUserMW(objRepo)
    );

    app.put(
        '/api/user/:userID',
        authMW(objRepo),
        checkUserDataMW(objRepo),
        updateUserMW(objRepo)
    );

    app.delete(
        '/api/user/:userID',
        authMW(objRepo),
        deleteUserMW(objRepo)
    );

    app.get(
        '/api/products/:categoryID/page/:page',
        getCurrenciesMW(objRepo),
        getProductsMW(objRepo)
    );

    app.get(
        '/api/products',
        getCurrenciesMW(objRepo),
        getRecommendedProductsMW(objRepo)
    );

    app.get(
        '/api/products/search/:query/page/:page',
        getCurrenciesMW(objRepo),
        searchProductsMW(objRepo)
    );

    app.post(
        '/api/subscribe',
        authMW(objRepo),
        subscribeMW(objRepo)
    );

}
