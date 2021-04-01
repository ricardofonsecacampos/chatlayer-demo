const { Pool } = require('pg');
console.log('importou pg')

connectionString = {
  connectionString: process.env.DATABASE_URL,
  ssl: true
};

// avoid self signed certificate problem.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const pool = new Pool(connectionString);
pool.on('connect', () => console.log('connected to db'));

pool.query("create table if not exists roof_order (product varchar(40) not null, quantity smallint not null, order_date date not null)",
           (err, res) => {
  console.log(err)
});

//pool.query("select * from pg_catalog.pg_database",
pool.query("select * from roof_order",
           (err, res) => {
  console.log(err, res)
  //pool.end()
});
