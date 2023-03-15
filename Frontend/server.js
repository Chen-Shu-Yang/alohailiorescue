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

// go to Foster Form
app.get('/fosterform', (req, res) => {
  res.sendFile('/public/assets/html/fosterForm.html', { root: __dirname });
});

// go to Adroptable Dog List
app.get('/adoptabledogs', (req, res) => {
  res.sendFile('/public/assets/html/adoptableDogs.html', { root: __dirname });
});

// go to Adroptable Dog List
app.get('/adoptionfees', (req, res) => {
  res.sendFile('/public/assets/html/adoptionFees.html', { root: __dirname });
});

// go to Donation
app.get('/donate', (req, res) => {
  res.sendFile('/public/assets/html/donate.html', { root: __dirname });
});

// go to Item & Food Donation
app.get('/itemdonate', (req, res) => {
  res.sendFile('/public/assets/html/itemDonation.html', { root: __dirname });
});

// go to Volunteer
app.get('/volunteer', (req, res) => {
  res.sendFile('/public/assets/html/volunteer.html', { root: __dirname });
});

// go to Sponsorship
app.get('/sponsorships', (req, res) => {
  res.sendFile('/public/assets/html/sponsorship.html', { root: __dirname });
});

// go to Shop
app.get('/shop', (req, res) => {
  res.sendFile('/public/assets/html/shop.html', { root: __dirname });
});

// go to Products
app.get('/product', (req, res) => {
  res.sendFile('/public/assets/html/product.html', { root: __dirname });
});

// go to Cart
app.get('/cart', (req, res) => {
  res.sendFile('/public/assets/html/cart.html', { root: __dirname });
});

// go to Checkout
app.get('/checkout', (req, res) => {
  res.sendFile('/public/assets/html/checkout.html', { root: __dirname });
});

// retrieve from public folder
app.use(serveStatic(`${__dirname}/public`));

app.listen(port, hostname, () => {
  console.log(`Server hosted at http://${hostname}:${port}`);
});
