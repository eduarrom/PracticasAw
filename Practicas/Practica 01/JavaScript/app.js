const express = require('express');
const bodyParser = require('body-parser');
const daoUsers = require('daoUsers');
const parser = require('parser');
const mysql = require('mysql');

var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(express.static('.'));

var pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "1234",
	database: "facebluff"
  });

var daoUser = new daoUsers(pool);

app.listen(3000, function () {
  console.log('Practica 1 en el puerto 3000');
});

let usuario = {
	email: null,
	nombre: null,
	sexo: null,
	fechaNacimiento: null,
	fotoPerfil: null
}

app.get('/', function(request, response){
	if (usuario.email == null){
		response.redirect("/login.html");
	} else {
		response.redirect("/usuarioRegistrado/friends.html");
	}
})

app.post('/login', function (request, response) {
	if (parser.parsePass(request.body.pass)){
		daoUser.getUser(request.body.email, request.body.pass, function(err, rows){
			if (err) {
				response.write(err.message);
			} else {			
				if (rows.length == 0){
					response.redirect("/login.html");
				} else if (rows[0].password != request.body.pass) {
					response.redirect("/login.html");
				} else {
					response.redirect("/usuarioRegistrado/friends.html");
					usuario.email = rows[0].email;
					usuario.nombre = rows[0].name;
					usuario.sexo = rows[0].gender;
					usuario.fechaNacimiento = rows[0].birthdate;
					usuario.imagenPerfil = rows[0].image;
				}
			}
			/*
			response.cookie("usuario", {
				email: rows[0].email,
				nombre: rows[0].nombre,
				sexo: rows[0].sexo,
				fechaNacimiento: rows[0].fechaNacimiento,
				imagenPerfil: rows[0].imagenPerfil
			})
			*/
		})
	} else {
		response.redirect("/login.html");
	}
});

app.post('/new_user', function(request, response){
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