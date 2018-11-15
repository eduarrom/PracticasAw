"using strict";

const express = require("express");
const mysql = require("mysql");
const config = require("./config");
const DAO = require("./DAOTasks");

const app = express();
const pool = mysql.createPool(config.mysqlConfig);
const taskDao = new DAO(pool);

app.listen(config.port,(err)=>{
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    } 
})
