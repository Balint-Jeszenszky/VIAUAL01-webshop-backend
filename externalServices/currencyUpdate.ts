import { ICurrency } from '../models/Currency';
import { Model } from 'mongoose';
import requireOption from '../middleware/generic/requireOption';
import ObjectRepository from '../models/ObjectRepository';
import axios from 'axios';

export default function(objRepo: ObjectRepository) {
    const CurrencyModel: Model<ICurrency> = requireOption(objRepo, 'Currency');

    return async function() {
        const base = process.env.DEFAULT_CURRENCY;
        const response = await axios.get(`https://api.exchangeratesapi.io/latest?base=${base}`);

        const currencies = await CurrencyModel.find({});

        for (const c of currencies) {
            c.price = (1 + c.charge) * response.data.rates[c.name];
            await c.save();
        }
    }
}
