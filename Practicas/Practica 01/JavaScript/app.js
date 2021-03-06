//Definicion de modulos externos
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const expressSession = require("express-session");
const expressMySqlSession = require("express-mysql-session");
const multer = require("multer");
const { body, validationResult } = require('express-validator/check');
const fs = require('fs');

/*
*
*	Expresiones regulares para parseo de campos
*
*/

/*
	Desde el principio del string hasta el final solo aceptamos caracteres
	alfanumericos
*/
const expresionPass = /^\w+$/;

/*
	Al principio del string 1 o mas caracteres alfanumericos, una @, 
	1 o mas caracteres alfanumericos, un punto y 1 o mas caracteres alfanumericos.
*/
const expresionEmail = /^\w+(@){1}\w+(\.){1}\w+$/

const expresionName = /^[A-Z]{1}[a-zA-Z\s]+$/

/*
*
*	Definicion de modulos creados
*
*/

const config = require("./config");
const saUsers = require('./business/saUsers');

const pool = mysql.createPool(config.mysqlConfig);

const MySqlStore = expressMySqlSession(expressSession);
const sessionStore = new MySqlStore(config.mysqlConfig);
const multerFactory = multer({ storage: multer.memoryStorage() });

var app = express();

//Usar bodyParser para obtener los atributos pasados por post
app.use(bodyParser.urlencoded({extended:false}));

//Usar el directorio public para los directorios estaticos
app.use(express.static(path.join(__dirname, "../public")));

//Usar ejs y el directorio views de public para las paginas dinamicas
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "../public", "views"))

app.use(expressSession({resave:false, saveUninitialized:false, secret:"foobar34", store:sessionStore}));

app.listen(3000, function () {
  console.log('Practica 1 en el puerto 3000');
});

/*
*
*	Funcion para controlar el acceso a determinadas paginas
*
*/

function controlAcceso(request, response, next){
    if (request.session.currentUser != null){
        response.locals.currentUser = request.session.currentUser;
        next();
    } else {
        response.redirect("/login");
    }
}

/*
*
*	Definicion de rutas
*
*/

app.get('/', controlAcceso, function(request, response){
	response.redirect("/friends");
})

app.get('/login', function(request, response){
	response.render("login", {errors: null})
})

app.post('/doLogin', [
	body('email')
	.not().isEmpty().withMessage('El email no puede dejarse en blanco')
	.custom(value => expresionEmail.test(value)).withMessage('El formato del email no es correcto'),
	body('pass')
	.not().isEmpty().withMessage('La contraseña no puede dejarse en blanco')
	.isLength({ min: 8 }).withMessage('La contraseña tiene que tener como minimo 8 caracteres')
	.custom(value => expresionPass.test(value)).withMessage('El formato de la contraseña no es correcto'),
], function (request, response) {

	var errors = validationResult(request).array();
	if (errors.length > 0) {
		let params = [];
		errores = errors.filter(function(elem){
			if (params.indexOf(elem.param) == -1){
				params.push(elem.param);
				return true;
			} else {
				return false;
			}
		})
		return response.status(422).render("login.ejs", { errors: errores });
	}

	saUsers.doLogin({
		email: request.body.email,
		name: null,
		gender: null,
		years: null,
		points: null
	}, request.body.pass, pool, function(cod, err, content){
		switch(cod){
			case 0:
				request.session.currentUser = content;
				response.locals.currentUser = request.session.currentUser;
				response.redirect("/friends");	
				break;
			case -1:
			case -2:
			case -3:
			case -5:
				response.render("login.ejs", {errors: [{msg: err}]	});
				break;
			default:
				response.redirect("/login");
				break;
		}
		response.end();
	});
});

app.get('/new_user', function(request, response){
	response.render("new_user.ejs",{errors:null})
});

app.post('/addUser', multerFactory.single("image"), [
	body('email')
	.not().isEmpty().withMessage('El email no puede dejarse en blanco')
	.custom(value => expresionEmail.test(value)).withMessage('El formato del email no es correcto'),
	body('pass')
	.not().isEmpty().withMessage('La contraseña no puede dejarse en blanco')
	.isLength({ min: 8 }).withMessage('La contraseña tiene que tener como minimo 8 caracteres')
	.custom(value => expresionPass.test(value)).withMessage('El formato de la contraseña no es correcto'),
	body('name')
	.not().isEmpty().withMessage('El nombre no puede dejarse en blanco')
	.custom(value => expresionName.test(value)).withMessage('El formato del nombre no es correcto'),
	body('birth')
	.not().isEmpty().withMessage('La fecha no puede dejarse en blanco')
], function(request, response){

	var errors = validationResult(request).array();
	if (errors.length > 0) {
		let params = [];
		errores = errors.filter(function(elem){
			if (params.indexOf(elem.param) == -1){
				params.push(elem.param);
				return true;
			} else {
				return false;
			}
		})
		return response.status(422).render("new_user.ejs", { errors: errores });
	}

	let user = {
		email: request.body.email,
		name: request.body.name,
		password: request.body.pass,
		gender: request.body.gender,
		birthdate: request.body.birth,
		image: null
	}

	if (request.file !== undefined){
		user.image = request.file.buffer;
	}

	saUsers.addUser(user,pool,function(code,err){
		switch(code){		
		case -1:
			response.render("new_user.ejs",{errors: [{msg: err}]} );
			break;
		default:
			response.redirect("/login");
			break
		}
	})
	
})

app.get('/friends', controlAcceso, function(request, response){
	saUsers.getFriends(request.session.currentUser.id, pool, function(friends){
		saUsers.getPendingFriendRequest(request.session.currentUser.id,pool,(err,friendRequest)=>{
			response.render("friends.ejs", {friendRequest:friendRequest, friends: friends});
		})
	});
});

app.post("/answerRequest", controlAcceso, (request,response)=>{
	saUsers.confirmRequest(request.body.id,request.session.currentUser.id,request.body.botonSolicitud=="Aceptar",pool,(err)=>{
		response.redirect("/friends");
	})
})

app.get('/profile/:id', controlAcceso, function(request, response){
	saUsers.getUserData(request.params.id,pool,(err,user)=>{
		response.render("profile.ejs",{user:user,canModify:request.params.id == request.session.currentUser.id});
	})
});

app.get('/modify_user', controlAcceso, (request,response)=>{
	response.render("modify_user.ejs",{user:request.session.currentUser,errors:null});
})

app.post("/doModify", controlAcceso, multerFactory.single("image"), [
	body('email')
	.not().isEmpty().withMessage('El email no puede dejarse en blanco')
	.custom(value => expresionEmail.test(value)).withMessage('El formato del email no es correcto'),
	body('password')
	.custom(value => value.length == 0 || value.length >= 8).withMessage('La contraseña tiene que tener como minimo 8 caracteres')
	.custom(value =>  value.length == 0 || expresionPass.test(value)).withMessage('El formato de la contraseña no es correcto'),
	body('name')
	.not().isEmpty().withMessage('El nombre no puede dejarse en blanco')
	.custom(value => expresionName.test(value)).withMessage('El formato del nombre no es correcto'),
	body('birth')
	.not().isEmpty().withMessage('La fecha no puede dejarse en blanco'),
], (request,response)=>{

	var errors = validationResult(request).array();
	if (errors.length > 0) {
		let params = [];
		errores = errors.filter(function(elem){
			if (params.indexOf(elem.param) == -1){
				params.push(elem.param);
				return true;
			} else {
				return false;
			}
		})
		return response.status(422).render("modify_user.ejs", { errors: errores });
	}

	let user = {
		email: request.body.email,
		name: request.body.name,
		password: request.body.password,
		gender: request.body.gender,
		birthdate: request.body.birth,
		points: request.session.currentUser.points,
		image: null,
	}

	if (request.body.deleteImage){
		user.image = null;
	} else {
		if (request.file !== undefined){
			user.image = request.file.buffer;
		}
	}

	saUsers.modifyUser(request.session.currentUser.id,user,pool,(cod, err, userMod)=>{
		switch(cod){
			case 0: 
				request.session.currentUser = userMod;
				response.locals.currentUser = request.session.currentUser;
				response.redirect("profile/"+request.session.currentUser.id);
				break;
			case -1:
				response.render("modify_user.ejs",{user:request.session.currentUser,errors: [{ msg: err}]});
				break;
		}		
	})

})

app.get('/disconnect', function(request, response){
	request.session.destroy();
	response.redirect("/login");
})

app.get("/getUserImage/:email", function(request, response){
	let email = request.params.email;
	saUsers.getImage(email, pool, function(cod, image){
		switch (cod){
			case 0:
				response.end(image);
				break;
			case -1:
				fs.readFile(path.join(__dirname, "../public/images/users","noImage.png"), function(err, data){
					response.end(data);
				});
				break;
			case -2:
				response.status(400);
				response.end("Peticion Incorrecta");
				break;
		}
	})
})

app.get("/searchFriend",controlAcceso,(request,response)=>{
	saUsers.searchByName(request.query.name,request.session.currentUser.id,pool,(err,list)=>{
		response.render("search.ejs",{list:list});
	});
})

app.post("/sendFriendRequest",controlAcceso,(request,response)=>{
	saUsers.sendFriendRequest(request.session.currentUser.id,request.body.id,pool,(err)=>{
		response.redirect("/friends");
	})
})

app.use(function(request, response, next){
	response.render("404.ejs",{currentUser:request.session.currentUser});
})