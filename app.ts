import express from 'express';
import routes from './routes/routes';
import helmet from 'helmet';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';
import externalServices from './externalServices/externalServices';
import createAdmin from './services/createAdmin';
import dotenv from 'dotenv';
import cors from 'cors'; // remove in production code

dotenv.config();

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, process.env.LOG_FILE || 'access.log'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }));
//app.use(helmet());
app.use(express.static('static'));
app.use(express.json());

if (process.env.NODE_ENV === 'DEVELOPMENT') { // remove in production code
    app.use(cors()); // for separate client development
    //app.use((req, res, next) => setTimeout(next, 200)); // artificial latency
    //app.use(morgan('combined'));
}

externalServices();
createAdmin();
routes(app);

app.use((err: express.ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).end('Something went wrong...');
    console.log(`Error: ${err}`);
});

export default app;
