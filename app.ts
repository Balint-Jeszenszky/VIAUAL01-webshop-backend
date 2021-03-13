import express from 'express';
import routes from './routes/routes';
import dotenv from 'dotenv'; // remove in production code
import cors from 'cors'; // remove in production code

dotenv.config(); // remove in production code

const app = express();

if (process.env.NODE_ENV === 'DEVELOPMENT') app.use(cors()); // remove in production code

routes(app);

app.use((err: express.ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).end('Something went wrong...');
    console.log(err);
});

export default app;
