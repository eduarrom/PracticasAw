"using strict";

const DAOTasks = require("./DAOTasks");
const DAOUsers = require("./DAOUsers");

const express = require("express");
const mysql = require("mysql");
const config = require("./config");
const path = require("path");
const body_parser = require("body-parser");
const expressSession = require("express-session");
const expressMySqlSession = require("express-mysql-session");

const MySqlStore = expressMySqlSession(expressSession);
const sessionStore = new MySqlStore(config.mysqlConfig);

const app = express();
const pool = mysql.createPool(config.mysqlConfig);

const taskDao = new DAOTasks(pool);
const userDao = new DAOUsers(pool);

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "public", "views"));

app.use(express.static("public"));
app.use(body_parser.urlencoded({extended:false}));
app.use(expressSession({resave:false, saveUninitialized:false, secret:"foobar34", store:sessionStore}));

function controlAcceso(request, response, next){
    if (request.session.currentUser != null){
        response.locals.userEmail = request.session.currentUser;
        next();
    } else {
        response.redirect("/login");
    }
}

app.get("/login",(request,response)=>{
    response.render("login.ejs",{errorMsg:null});
});

app.post("/login",(request,response)=>{
    userDao.isUserCorrect(request.body.email,request.body.password,(err,isCorrect)=>{
        if(err)
            response.render("login.ejs",{errorMsg:"Error del servidor"});
        else if(isCorrect){
            request.session.currentUser = request.body.email;
            response.redirect("/tasks");
        }else
            response.render("login.ejs",{errorMsg:"Direccion de correo y/o contraseña no válidos"});
    })
})

app.get("/logout",(request,response)=>{
    request.session.destroy();
    response.redirect("/login");
})

app.get("/tasks",controlAcceso,(request,response)=>{

    taskDao.getAllTasks(request.session.currentUser,(err,list)=>{
            if(err){
                console.log(err);
                list = [];
            }
            response.render("tasks.ejs",{error:err,lista:list});
    })
});

app.post("/addTask",controlAcceso,(request,response)=>{
    
    taskDao.insertTask(request.session.currentUser,{text:request.body.tarea,done:0},(err)=>{
        if (err){console.log(err)}
        response.redirect("/tasks");
    });
});

app.get("/finish/:taskId",controlAcceso,(request,response)=>{
    taskDao.markTaskDone(request.params.taskId,(err)=>{
        if (err){console.log(err)}
        response.redirect("/tasks");
    })
});

app.get("/deleteCompleted",controlAcceso,(request,response)=>{
    taskDao.deleteCompleted(request.session.currentUser,(err)=>{
        if (err){console.log(err)}
        response.redirect("/tasks");
    })
});

app.get("/imagenUsuario",(request,response)=>{

    userDao.getUserImageName(request.session.currentUser,(err,image)=>{
        if(err || image==null){
            response.sendFile(path.join(__dirname, "profile_imgs", "NoPerfil.png"));
        }else{
            response.sendFile(path.join(__dirname, "profile_imgs", image));
        }
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
