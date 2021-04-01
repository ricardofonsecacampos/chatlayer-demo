// import Postgre module.
const { Pool } = require('pg');

// retrieves the connection data from environment variable.
connectionString = {
  connectionString: process.env.DATABASE_URL,
  ssl: true
};

// list all submited orders.
function listOrder(callback) {
  pool.query("select * from roof_order", (err, res) => {
    if (err) console.log(err)
    else callback(res.rows)
    //pool.end()
  });
}

// avoid self signed certificate problem.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const pool = new Pool(connectionString);

// done before any database operation.
pool.on('connect', () => console.log('db operation'));

// assures the order table is OK.
pool.query("drop table roof_order",
//pool.query("create table if not exists roof_order (product varchar(40) not null, quantity smallint not null, order_date date not null)",
           (err, res) => {
  if (err) console.log(err)
});

//listOrder((rows) => console.log(rows))

//pool.query("select * from pg_catalog.pg_database",
//pool.query("insert into roof_order (product, quantity, order_date) values ('tiles', 25, current_date)",
//           (err, res) => {
//  if (err) console.log(err)
//});

module.exports = { listOrder }
