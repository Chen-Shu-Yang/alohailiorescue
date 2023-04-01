// get data from dbconfig
const {
  databaseUserName, databaseHost, database, databasePassword,
} = require('../dbConfig');

//= ======================================================
//              Imports
//= ======================================================
// eslint-disable-next-line import/order
const mysql = require('mysql');

//= ======================================================
//              Objects / Functions
//= ======================================================
const config = (
  {
    user: databaseUserName,
    password: databasePassword,
    host: databaseHost,
    database: database,
  }
);

// eslint-disable-next-line new-cap
const pool = new mysql.createPool(config);

//= ======================================================
//              Exports
//= ======================================================
module.exports = pool;
