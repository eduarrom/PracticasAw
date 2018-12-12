const mysql = require('mysql');
const config = require("../../config");
const pool = mysql.createPool(config.mysqlConfig)
module.exports = pool;
