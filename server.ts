import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/routes';

dotenv.config();

const app = express();

routes(app);

app.use((err: express.ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.end('Something went wrong...');
    console.log(err);
});

const port = process.env.SERVER_PORT || 3000;

app.listen(port, function () {
    console.log(`Listening on :${port}`);
});

export default app;
