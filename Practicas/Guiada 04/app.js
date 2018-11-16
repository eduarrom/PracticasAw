"using strict";

const express = require("express");
const mysql = require("mysql");
const config = require("./config");
const DAO = require("./DAOTasks");
const path = require("path");
const body_parser = require("body-parser");

const app = express();
const pool = mysql.createPool(config.mysqlConfig);
const taskDao = new DAO(pool);

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "public", "views"));

app.use(express.static("public"));
app.use(body_parser.urlencoded({extended:false}));

app.get("/tasks",(request,response)=>{

    taskDao.getAllTasks("usuario@ucm.es",(err,list)=>{
            if(err){
                console.log(err);
                list = [];
            }
            response.render("tasks.ejs",{error:err,lista:list});
    })
});

app.post("/addTask",(request,response)=>{

    taskDao.insertTask("usuario@ucm.es",{text:request.body.tarea,done:0},(err)=>{
        if (err){console.log(err)}
        response.redirect("/tasks");
    });
});

app.get("/finish/:taskId",(request,response)=>{
    taskDao.markTaskDone(request.params.taskId,(err)=>{
        if (err){console.log(err)}
        response.redirect("/tasks");
    })
});

app.get("/deleteCompleted",(request,response)=>{
    taskDao.deleteCompleted("usuario@ucm.es",(err)=>{
        if (err){console.log(err)}
        response.redirect("/tasks");
    })
});


app.listen(config.port,(err)=>{
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    } 
})
