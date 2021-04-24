import cron from 'node-cron';

import currencyUpdate from './currencyUpdate';

import ObjectRepository from '../models/ObjectRepository';
import Currency from '../models/Currency';

export default function() {

    const objRepo: ObjectRepository = {
        Currency
    }

    cron.schedule(
        `0 ${process.env.CURRENCY_UPDATE_HOUR ?? '4'} * * *`,
        currencyUpdate(objRepo)
    );
}