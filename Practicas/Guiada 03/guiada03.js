"use strict";

const mysql = require("mysql");
const config = require("./config");
const DAOUsers = require("./DAOUsers");
const DAOTasks = require("./DAOTasks");

// Crear el pool de conexiones
const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

let daoUser = new DAOUsers(pool);
let daoTask = new DAOTasks(pool);

daoUser.isUserCorrect("usuario@ucm.es", "mipass", cb_isUserCorrect);

function cb_isUserCorrect(err, result){
   if (err) {
       console.log(err.message);
   } else if (result) {
       console.log("Usuario y contraseña correctos");
   } else {
       console.log("Usuario y/o contraseña incorrectos");
   }
}

daoUser.getUserImageName("usuario@ucm.es", cb_getUserImageName);

function cb_getUserImageName(err, result){
   if (err) {
       console.log(err.message);
   } else if (result) {
       console.log("Ruta de la imagen: " + result);
   } else {
       console.log("El usuario no tiene imagen");
   }
}

daoTask.getAllTasks("usuario@ucm.es", cb_getAllTasks);

function cb_getAllTasks(err, result){
   if (err) {
       console.log(err);
   } else if (result) {
        if(result.length == 0){
            console.log("El usuario no tiene tareas");
        } else{
            console.log(JSON.stringify(result, null, 4));
        }
    }
}

daoTask.markTaskDone(3, cb_markTaskDone);

function cb_markTaskDone(err, result){
   if (err) {
       console.log(err);
   } else {
       console.log("Tarea marcada como completada")
   }
}

daoTask.insertTask("usuario@ucm.es", {text: "Lavarse", done: 0, tags:["bañera", "higiene", "hueles"]}, cb_insertTask);

function cb_insertTask(err, result){
   if (err) {
       console.log(err);
   } else {
       console.log("Tarea insertada correctamente")
   }
}




