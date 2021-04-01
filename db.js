const { Pool } = require('pg');

connectionString = {
  connectionString: process.env.DATABASE_URL,
  ssl: true
};

// avoid self signed certificate problem.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const pool = new Pool(connectionString);
pool.on('connect', () => console.log('db operation'));

pool.query("create table if not exists roof_order (product varchar(40) not null, quantity smallint not null, order_date date not null)",
           (err, res) => {
  if (err) console.log(err)
  pool.end()
});

//pool.query("select * from pg_catalog.pg_database",
pool.query("insert into roof_order (product, quantity, order_date) values ('tiles', 25, current_date)",
           (err, res) => {
  if (err) console.log(err) else console.log(res)
  pool.end()
});

pool.query("select * from roof_order",
           (err, res) => {
  if (err) console.log(err) else console.log(res)
  pool.end()
});
