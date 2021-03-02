import express from 'express';
import routes from './routes/routes';

const app = express();

routes(app);

app.use((err: express.ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.end('Something went wrong...');
    console.log(err);
});

export default app;
