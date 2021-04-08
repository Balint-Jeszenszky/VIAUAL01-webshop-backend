import app from './app';

const port = process.env.SERVER_PORT || 3000;

app.listen(port, function () {
    console.log(`Listening on :${port}`);
});
