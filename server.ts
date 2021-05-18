import app from './app';
import colors from 'colors/safe';
// import https from 'https';
// import fs from 'fs';

const port = process.env.SERVER_PORT || 3000;

app.listen(port, function () {
    console.log(colors.green(`Listening on :${port}`));
});

// const key = fs.readFileSync(__dirname + '/certs/selfsigned.key');
// const cert = fs.readFileSync(__dirname + '/certs/selfsigned.crt');

// const server = https.createServer({ key, cert }, app);

// server.listen(port, () => {
//     console.log(`Listening on: ${port}`);
// });
