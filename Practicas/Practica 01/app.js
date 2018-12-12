//Definicion de modulos externos
const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require("express-session");
const expressMySqlSession = require("express-mysql-session");
const path = require('path');

const config = require("./config");

//Definicion de routers
const questionsRouter =require("./JavaScript/questionsRouter");
const userRouter = require("./JavaScript/usersRouter");

var app = express();

//MIDDLEWARES
	const MySqlStore = expressMySqlSession(expressSession);
	const sessionStore = new MySqlStore(config.mysqlConfig);

	//Usar bodyParser para obtener los atributos pasados por post
	app.use(bodyParser.urlencoded({extended:false}));

	//Usar el directorio public para los directorios estaticos
	app.use(express.static(path.join(__dirname, "/public")));5

	//Usar ejs y el directorio views de public para las paginas dinamicas
	app.set("view engine","ejs");
	app.set("views", path.join(__dirname, "/public", "views"))

	app.use(expressSession({resave:false, saveUninitialized:false, secret:"foobar34", store:sessionStore}));

	//ROUTERS
	app.use("/users",userRouter);
	app.use("/questions",questionsRouter);


//redireccion a login
app.get("/",(request,response)=>{
	response.redirect("/users/login");
})
//Por si no existe un manejador para esa peticion...
app.use(function(request, response, next){
	response.status(404);
	response.render("404.ejs",{currentUser:request.session.currentUser});
})


app.listen(3000, function () {
	console.log('Practica 1 en el puerto 3000');
  });