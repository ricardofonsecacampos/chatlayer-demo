// import Postgre module.
const { Pool } = require('pg');

// retrieves the connection data from environment variable.
connectionString = {
  connectionString: process.env.DATABASE_URL,
  ssl: true
};

let pool = null

// list all submited orders.
function listOrder(callback) {
  // it's not right to create the pool always.
  connect();
  
  //pool.query("select * from pg_catalog.pg_database",
  pool.query("select * from roof_order", (err, res) => {
    if (err) console.log(err)
    else callback(res.rows)
    pool.end()
  });
}

// list all submited orders.
function saveOrder(order) {
  // it's not right to create the pool always.
  connect();
  
  pool.query("insert into roof_order (product, quantity, value, order_date) values ('" + order.product + "', " + order.quantity + ", " + order.value + ", current_date)",
             (err, res) => {
    if (err) console.log(err)
    pool.end()
  });
}

// creates the connection to the database.
function connect() {
  pool = new Pool(connectionString);
  // done before any database operation.
  pool.on('connect', () => console.log('db operation'));  
}

// avoid self signed certificate problem.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

connect();
// assures the order table is OK.
//pool.query("drop table roof_order",
pool.query("create table if not exists roof_order (product varchar(40) not null, quantity smallint not null, value float not null, order_date timestamp not null)",
           (err, res) => {
  if (err) console.log(err)
  pool.end()
});

connect();
// sample data.
pool.query("insert into roof_order (product, quantity, value, order_date) values ('tiles', 25, 180.55, current_date)",
           (err, res) => {
  if (err) console.log(err)
  pool.end()
});

listOrder((rows) => console.log(rows))

module.exports = { listOrder, saveOrder }
