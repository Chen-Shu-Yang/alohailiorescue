const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const serveStatic = require('serve-static');

// set hostname and portnumber
const hostname = '0.0.0.0';
const port = process.env.PORT || 3001;

const app = express();

app.use((req, res, next) => {
  if (req.method !== 'GET') {
    res.type('.html');
    const msg = '<html><body>This server only serves web pages with GET!</body></html>';
    res.end(msg);
  } else {
    next();
  }
});

// go to homepage
app.get('/', (req, res) => {
  res.sendFile('/public/assets/html/home.html', { root: __dirname });
});

// retrieve from public folder
app.use(serveStatic(`${__dirname}/public`));

app.listen(port, hostname, () => {
  console.log(`Server hosted at http://${hostname}:${port}`);
});
