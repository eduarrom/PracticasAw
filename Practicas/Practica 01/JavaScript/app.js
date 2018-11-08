var express = require('express');
var bodyParser = require('body-parser');
var dao = require('./integration/dao.js');

var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(express.static('.'));

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

app.get('/usuarioRegistrado/' + /.*/, function(request, response){
	if (usuario.email == null){
		response.redirect("/login.html");
	}
})

app.get('/', function(request, response){
	if (usuario.email == null){
		response.redirect("/login.html");
	} else {
		response.redirect("/usuarioRegistrado/friends.html");
	}
})

app.post('/login', function (request, response) {
	if (dao.parsePass(request.body.pass)){
		dao.getUsers(request.body.email, request.body.pass, function(err, rows){
			if (err) {
				response.write(err.message);
			} else {			
				if (rows.length == 0){
					response.redirect("/login.html");
				} else if (rows[0].pass != request.body.pass) {
					response.redirect("/login.html");
				} else {
					response.redirect("/usuarioRegistrado/friends.html");
					usuario.email = rows[0].email;
					usuario.nombre = rows[0].nombre;
					usuario.sexo = rows[0].sexo;
					usuario.fechaNacimiento = rows[0].fechaNacimiento;
					usuario.imagenPerfil = rows[0]
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

app.get('./usuarioRegistrado/my_profile.html', function(request, response){
	response.
	request.document.getElementById("nombreUsuario").write(usuario.nombre);
})