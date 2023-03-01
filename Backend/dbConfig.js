// importing dotenv
require('dotenv').config();

// extracting info from .env file
module.exports =
{
  databaseUserName: process.env.USER,
  databasePassword: process.env.PASSWORD,
  databaseName: process.env.DATABASE,
  databaseHost: process.env.HOST,
};