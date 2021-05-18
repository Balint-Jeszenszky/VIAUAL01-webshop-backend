import axios from 'axios';

export default async function getAvailableCurrencies(base: string, apiKey: string) {
    const response = await axios.get(`http://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}`);

    const basePrice = response.data.rates[base!];

    const rebased: { [key: string]: number } = {};

    Object.entries(response.data.rates).forEach(e => {
        rebased[e[0]] = (e[1] as number) / basePrice;
    });

    return rebased;
}