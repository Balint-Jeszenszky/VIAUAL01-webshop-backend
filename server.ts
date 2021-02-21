import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const port = process.env.SERVER_PORT || 3000;

app.listen(port, function () {
    console.log(`Listening on :${port}`);
});
