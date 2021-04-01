const { Pool } = require('pg');

connectionString = {
  connectionString: process.env.DATABASE_URL,
  ssl: true
};

const pool = new Pool(connectionString);
pool.on('connect', () => console.log('connected to db'));
