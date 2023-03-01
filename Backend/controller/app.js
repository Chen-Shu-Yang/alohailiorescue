// ====================== Imports ======================
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
// Unique String
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const printDebugInfo = require('../middlewares/printDebugInfo');

const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();
// MF Configurations
app.use(urlEncodedParser);
app.use(jsonParser);
app.options('*', cors());
app.use(cors());

// ====================== Sanity Check ======================
app.get('/', (req, res) => {
  res.status(200).send('HelloWorld');
});


// ====================== Exports ======================
module.exports = app;