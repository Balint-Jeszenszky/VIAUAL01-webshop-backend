import express from 'express';
import routes from './routes/routes';
import helmet from 'helmet';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';
import externalServices from './externalServices/externalServices';
import createAdmin from './services/createAdmin';
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, process.env.LOG_FILE || 'access.log'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }));
//app.use(helmet());
app.use(express.static('static'));
app.use(express.json());

externalServices();
createAdmin();
routes(app);

app.use((err: express.ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).end('Something went wrong...');
    console.log(colors.red(`Error: ${err}`));
});

app.use('/*', (req, res, next) => res.sendFile(path.join(__dirname, './static/index.html')));

export default app;
