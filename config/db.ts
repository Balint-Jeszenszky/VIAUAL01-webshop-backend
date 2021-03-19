import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

if (process.env.NODE_ENV === 'test') {
    const mongoServer = new MongoMemoryServer();
    mongoServer.getUri().then((mongoUri) => {
        mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    });
} else {
    mongoose.connect(process.env.DB_CONN || 'mongodb://localhost/webshop', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
}

export default mongoose;
