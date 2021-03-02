import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const port = process.env.SERVER_PORT || 3000;

app.listen(port, function () {
    console.log(`Listening on :${port}`);
});
