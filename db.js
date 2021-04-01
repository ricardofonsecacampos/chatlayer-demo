const { Pool } = require('pg');
console.log('importou pg')

connectionString = {
  connectionString: process.env.DATABASE_URL,
  ssl: true
};

const pool = new Pool(connectionString);
pool.on('connect', () => console.log('connected to db'));

pool.query("create table if not exists order (product varchar(40) not null, quantity smallint not null, order_date date not null)",
           (err, res) => {
  console.log(err, res)
  pool.end()
});
