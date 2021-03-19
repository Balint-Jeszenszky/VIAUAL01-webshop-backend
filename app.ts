import express from 'express';
import routes from './routes/routes';
import Product from './models/Product';
import dotenv from 'dotenv'; // remove in production code
import cors from 'cors'; // remove in production code

dotenv.config(); // remove in production code

const app = express();

app.use(express.static('static'));

if (process.env.NODE_ENV === 'DEVELOPMENT') app.use(cors()); // for separate client development, remove in production code
if (process.env.NODE_ENV === 'DEVELOPMENT') app.use((req, res, next) => setTimeout(next, 200)); // artificial latency, remove in production code

routes(app);

app.use((err: express.ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).end('Something went wrong...');
    console.log(`Error: ${err}`);
});

export default app;
