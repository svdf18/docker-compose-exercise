// setup.js

require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);

  const setupScript = fs.readFileSync('./config/init.sql', 'utf8');
  connection.query(setupScript, (err, results, fields) => {
    if (err) throw err;
    console.log('Database and table created');
    connection.end();
  });
});
