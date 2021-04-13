import { ICurrency } from '../models/Currency';
import { Model } from 'mongoose';
import requireOption from '../middleware/generic/requireOption';
import ObjectRepository from '../models/ObjectRepository';
import getAvailableCurrencies from './getAvailableCurrencies';

export default function(objRepo: ObjectRepository) {
    const CurrencyModel: Model<ICurrency> = requireOption(objRepo, 'Currency');
    const base = process.env.DEFAULT_CURRENCY;
    const apiKey = process.env.EXCHANGERATES_API_KEY;
    if ((!base || !apiKey) && process.env.NODE_ENV !== 'test') {
        throw new TypeError('currency base or exchange api key undefined');
    }

    return async function() {
        const rebased = await getAvailableCurrencies(base!, apiKey!);

        const currencies = await CurrencyModel.find({});

        for (const c of currencies) {
            c.price = rebased[c.name];
            await c.save();
        }
    }
}
