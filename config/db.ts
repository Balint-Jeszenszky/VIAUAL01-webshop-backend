import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Mockgoose } from 'mockgoose';

dotenv.config();

if (process.env.NODE_ENV === 'test') {
    const mockgoose = new Mockgoose(mongoose);
    mockgoose.prepareStorage()
        .then(() => {
            mongoose.connect(process.env.DB_CONN || 'mongodb://localhost/webshop', { useNewUrlParser: true, useUnifiedTopology: true });
        });
} else {
    mongoose.connect(process.env.DB_CONN || 'mongodb://localhost/webshop', { useNewUrlParser: true, useUnifiedTopology: true });
}

export default mongoose;
