import cron from 'node-cron';

import currencyUpdate from './currencyUpdate';

import ObjectRepository from '../models/ObjectRepository';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';
import Order from '../models/Order';
import Currency from '../models/Currency';

export default function() {

    const objRepo: ObjectRepository = {
        Product,
        Category,
        User,
        Order,
        Currency
    }

    cron.schedule(
        `0 ${process.env.CURRENCY_UPDATE_HOUR ?? '4'} * * *`,
        currencyUpdate(objRepo)
    );
}