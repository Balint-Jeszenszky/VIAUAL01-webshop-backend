import { Model } from 'mongoose';

type ObjectRepository = {
    [key: string]: Model<any>
};

export default ObjectRepository;
