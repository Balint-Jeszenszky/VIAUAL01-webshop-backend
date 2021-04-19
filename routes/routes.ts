import express from 'express';
import cors from 'cors';
import multer, { MulterError } from 'multer';
import path from 'path';

import adminAccessMW from '../middleware/auth/adminAccessMW';
import authMW from '../middleware/auth/authMW';
import checkLoginMW from '../middleware/auth/checkLoginMW';
import checkRegMW from '../middleware/auth/checkRegMW';
import logoutMW from '../middleware/auth/logoutMW';
import refreshTokenMW from '../middleware/auth/refreshTokenMW';
import saveUserMW from '../middleware/auth/saveUserMW';

import addToCartMW from '../middleware/cart/addToCartMW';
import getCartMW from '../middleware/cart/getCartMW';
import updateCartMW from '../middleware/cart/updateCartMW';

import createCategoryMW from '../middleware/category/createCategoryMW';
import deleteCategoryMW from '../middleware/category/deleteCategoryMW';
import editCategoryMW from '../middleware/category/editCategoryMW';
import getCategoriesMW from '../middleware/category/getCategoriesMW';

import addCurrencyMW from '../middleware/currency/addCurrencyMW';
import deleteCurrencyMW from '../middleware/currency/deleteCurrencyMW';
import getAcceptedCurrenciesMW from '../middleware/currency/getAcceptedCurrenciesMW';
import getAllCurrenciesMW from '../middleware/currency/getAllCurrenciesMW';
import getAllowedCurrenciesMW from '../middleware/currency/getAllowedCurrenciesMW';
import getCurrenciesMW from '../middleware/currency/getCurrenciesMW';
import loadAllCurrenciesMW from '../middleware/currency/loadAllCurrenciesMW';
import updateCurrenciesMW from '../middleware/currency/updateCurrenciesMW';

import createNewAccessTokenMW from '../middleware/delivery/createNewAccessTokenMW'
import createCompanyMW from '../middleware/delivery/createCompanyMW'
import deleteCompanyMW from '../middleware/delivery/deleteCompanyMW'
import getCompaniesMW from '../middleware/delivery/getCompaniesMW'
import updateDeliveryMW from '../middleware/delivery/updateDeliveryMW'

import createOrder from '../middleware/order/createOrderMW';
import getOrderMW from '../middleware/order/getOrderMW';
import getOrdersMW from '../middleware/order/getOrdersMW';
import updateOrderMW from '../middleware/order/updateOrderMW';

import deleteProductMW from '../middleware/product/deleteProductMW';
import getAllProductsMW from '../middleware/product/getAllProductsMW';
import getProductMW from '../middleware/product/getProductMW';
import getProductsMW from '../middleware/product/getProductsMW';
import getRecommendedProductsMW from '../middleware/product/getRecommendedProductsMW';
import saveProductMW from '../middleware/product/saveProductMW';
import searchProductsMW from '../middleware/product/searchProductsMW';
import updateProductMW from '../middleware/product/updateProductMW';

import pushNotificationMW from '../middleware/pushNotifications/pushNotificationMW'
import subscribeMW from '../middleware/pushNotifications/subscribeMW'

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
import Company from '../models/Company';

export default function(app: express.Application) {
    const storage = multer.diskStorage({
        destination: 'static/images',
        filename: (req, file, cb) => {
            const name = file.originalname;
            const ext = path.extname(name);
            cb(null, `${name.substr(0, name.length - 4).split(' ').join('_')}_${Date.now()}_${Math.random().toString(36).substring(2,6)}${ext}`);
        }
    });

    const upload = multer({
        storage,
        limits: {
            fileSize: 1024*1024
        },
        fileFilter: (req, file, cb) => {
            const name = file.originalname;
            const ext = path.extname(name);
            const fileTypes = /jpeg|jpg|png|gif/;
            const valid = fileTypes.test(ext.toLowerCase()) && fileTypes.test(file.mimetype);
            cb(null, valid);
        }
    }).single('productImage');

    const objRepo: ObjectRepository = {
        Product,
        Category,
        User,
        Order,
        Currency,
        Company
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

    app.post(
        '/api/auth/refreshToken',
        refreshTokenMW(objRepo)
    );

    app.delete(
        '/api/auth/logout',
        logoutMW(objRepo)
    );

    app.get(
        '/api/cart/:userId',
        authMW(objRepo),
        getCurrenciesMW(objRepo),
        getCartMW(objRepo)
    );

    app.post(
        '/api/cart/:userId',
        authMW(objRepo),
        addToCartMW(objRepo)
    );

    app.put(
        '/api/cart/:userId',
        authMW(objRepo),
        updateCartMW(objRepo)
    );

    app.get(
        '/api/currencies',
        getCurrenciesMW(objRepo),
        getAcceptedCurrenciesMW(objRepo)
    );

    app.get(
        '/api/currencies/allowed',
        authMW(objRepo),
        adminAccessMW(objRepo),
        getCurrenciesMW(objRepo),
        getAllowedCurrenciesMW(objRepo)
    );

    app.get(
        '/api/currencies/all',
        authMW(objRepo),
        adminAccessMW(objRepo),
        getCurrenciesMW(objRepo),
        loadAllCurrenciesMW(objRepo),
        getAllCurrenciesMW(objRepo)
    );

    app.post(
        '/api/currencies',
        authMW(objRepo),
        adminAccessMW(objRepo),
        getCurrenciesMW(objRepo),
        loadAllCurrenciesMW(objRepo),
        addCurrencyMW(objRepo)
    );

    app.put(
        '/api/currencies/:currencyId',
        authMW(objRepo),
        adminAccessMW(objRepo),
        updateCurrenciesMW(objRepo)
    );

    app.delete(
        '/api/currencies/:currencyId',
        authMW(objRepo),
        adminAccessMW(objRepo),
        getCurrenciesMW(objRepo),
        deleteCurrencyMW(objRepo)
    );

    app.get(
        '/api/categories',
        getCategoriesMW(objRepo)
    );
    
    app.post(
        '/api/category',
        authMW(objRepo),
        adminAccessMW(objRepo),
        createCategoryMW(objRepo)
    );
    
    app.put(
        '/api/category/:categoryId',
        authMW(objRepo),
        adminAccessMW(objRepo),
        editCategoryMW(objRepo)
    );
    
    app.delete(
        '/api/category/:categoryId',
        authMW(objRepo),
        adminAccessMW(objRepo),
        deleteCategoryMW(objRepo)
    );

    app.get(
        '/api/delivery',
        authMW(objRepo),
        adminAccessMW(objRepo),
        getCompaniesMW(objRepo)
    );

    app.post(
        '/api/delivery',
        authMW(objRepo),
        adminAccessMW(objRepo),
        createCompanyMW(objRepo)
    );

    app.put(
        '/api/delivery',
        cors(),
        updateDeliveryMW(objRepo)
    );

    app.patch(
        '/api/delivery/:companyId',
        authMW(objRepo),
        adminAccessMW(objRepo),
        createNewAccessTokenMW(objRepo)
    );

    app.delete(
        '/api/delivery/:companyId',
        authMW(objRepo),
        adminAccessMW(objRepo),
        deleteCompanyMW(objRepo)
    );

    app.get(
        '/api/order/:orderID',
        authMW(objRepo),
        getCurrenciesMW(objRepo),
        getOrderMW(objRepo)
    );

    app.post(
        '/api/order/new/:userId',
        authMW(objRepo),
        createOrder(objRepo)
    );

    app.put(
        '/api/order/:orderID',
        authMW(objRepo),
        updateOrderMW(objRepo),
        pushNotificationMW(objRepo)
    );

    app.get(
        '/api/orders',
        authMW(objRepo),
        adminAccessMW(objRepo),
        getOrdersMW(objRepo)
    );

    app.get(
        '/api/product/:productID',
        getCurrenciesMW(objRepo),
        getProductMW(objRepo)
    );

    app.post(
        '/api/product',
        authMW(objRepo),
        adminAccessMW(objRepo),
        upload,
        saveProductMW(objRepo)
    );

    app.put(
        '/api/product/:productID',
        authMW(objRepo),
        adminAccessMW(objRepo),
        upload,
        updateProductMW(objRepo)
    );

    app.delete(
        '/api/product/:productID',
        authMW(objRepo),
        adminAccessMW(objRepo),
        deleteProductMW(objRepo)
    );

    app.get(
        '/api/user/:userId',
        authMW(objRepo),
        getUserMW(objRepo)
    );

    app.put(
        '/api/user/:userId',
        authMW(objRepo),
        checkUserDataMW(objRepo),
        updateUserMW(objRepo)
    );

    app.delete(
        '/api/user/:userId',
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
        '/api/products/all',
        authMW(objRepo),
        adminAccessMW(objRepo),
        getAllProductsMW(objRepo)
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
