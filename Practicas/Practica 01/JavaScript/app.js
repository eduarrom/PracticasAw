const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const cookieParser = require('cookie-parser');
const saUsers = require('saUsers');

var app = express();

//Usar bodyParser para obtener los atributos pasados por post
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//Usar cookieParser para analizar y obtener las cookies
app.use(cookieParser());

//Usar el directorio public para los directorios estaticos
app.use(express.static(path.join(__dirname, "../public")));

//Usar ejs y el directorio views de public para las paginas dinamicas
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "../public", "views"))

var pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "1234",
	database: "facebluff"
  });

app.listen(3000, function () {
  console.log('Practica 1 en el puerto 3000');
});

app.get('/', function(request, response){
	if (request.cookies.usuario != undefined){
		response.redirect("/login");
	} else {
		response.redirect("/friends");
	}
})

app.get('/login', function(request, response){
	response.status(200);
	response.render("login", null)
})

app.post('/doLogin', function (request, response) {
	let res = saUsers.doLogin({
		email: request.body.email,
		name: null,
		gender: null,
		years: null,
		image: null,
		points: null
	}, request.body.pass, pool, function(cod, err, content){
		switch(cod){
			case 0:
				response.cookie("user", content);
				response.redirect("/friends");
				break;
			case -1:
				response.redirect("/login");
				break;
			case -2:
				response.redirect("/login");
				break;
			case -3:
				response.redirect("/login");
				break;
			case -5:
				response.redirect("/login");
				break;
			default:
				response.redirect("/login");
				break;
		}
		response.end();
	});
});

app.get('/new_user', function(request, response){
	response.status(200);
	response.render("new_user", {user: request.cookies.user})
});

app.get('/friends', function(request, response){
	response.status(200);
	response.render("friends", {user: request.cookies.user})
});

app.get('/my_profile', function(request, response){
	response.status(200);
	response.render("my_profile", {user: request.cookies.user})
});

app.post('/addUser', function(request, response){
	let user = {
		email: request.body.email,
		name: request.body.name,
		password: request.body.pass,
		gender: request.body.gender,
		birthdate: request.body.birth,
		image: request.body.image == "" ? null : request.body.image
	}
	daoUser.addUser(user,function(err){
		if (err){
			response.redirect("/new_user.html");
		} else {
			response.redirect("/login.html");
		}
	})
})

app.get('/desconectar', function(request, response){
	response.clearCookie("user");
	response.redirect("/login");
})