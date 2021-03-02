import { IProduct } from './Product';
import { Model } from 'mongoose';

type ObjectRepository = {
    [index: string]: Model<IProduct>
};

export default ObjectRepository;
