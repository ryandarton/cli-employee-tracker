const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'SMTM2014',
  database: 'company_db',
});
module.exports = connection;
