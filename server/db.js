const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "bashorunbethel99",
    host: "localhost",
    port: "3000",
    database:"insuranceapp"
});



module.exports = pool;