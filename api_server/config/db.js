const mysql = require('mysql2')
require('dotenv').config();
const util = require('util');
const sleep = util.promisify(setTimeout);

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME
}

function connectWithRetry(maxAttempts = 5, interval = 5000) {
  let attempts = 0;

  return new Promise((resolve, reject) => {
    function attemptConnection() {
      const db = mysql.createConnection(dbConfig);

      db.connect(err => {
        if (err) {
          console.error('Error connecting to the database:', err);
          attempts++;

          if (attempts < maxAttempts) {
            console.log(`Retrying to connect in ${interval / 1000} seconds...`);
            sleep(interval).then(attemptConnection);
          } else {
            reject('Failed to connect to the database after several attempts.');
          }
        } else {
          console.log('Connected to the database.');
          resolve(db);
        }
      });
    }

    attemptConnection();
  });
}

module.exports = connectWithRetry;
