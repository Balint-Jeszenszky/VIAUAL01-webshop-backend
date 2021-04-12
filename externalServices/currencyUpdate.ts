import { ICurrency } from '../models/Currency';
import { Model } from 'mongoose';
import requireOption from '../middleware/generic/requireOption';
import ObjectRepository from '../models/ObjectRepository';
import axios from 'axios';

export default function(objRepo: ObjectRepository) {
    const CurrencyModel: Model<ICurrency> = requireOption(objRepo, 'Currency');
    const base = process.env.DEFAULT_CURRENCY;
    const apiKey = process.env.EXCHANGERATES_API_KEY;
    if ((!base || !apiKey) && process.env.NODE_ENV !== 'test') {
        throw new TypeError('currency base or exchange api key undefined');
    }

    return async function() {
        const response = await axios.get(`http://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}`);

        const currencies = await CurrencyModel.find({});

        const basePrice = response.data.rates[base!];

        const rebased: {[key: string]: number} = {};

        Object.entries(response.data.rates).forEach(e => {
            rebased[e[0]] = (e[1] as number) / basePrice;
        });

        for (const c of currencies) {
            c.price = (1 + c.charge) * rebased[c.name];
            await c.save();
        }
    }
}
