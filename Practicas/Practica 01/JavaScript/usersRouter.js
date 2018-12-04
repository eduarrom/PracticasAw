//Definicion de modulos externos
const express = require('express');
const path = require('path');
const multer = require("multer");
const multerFactory = multer({ storage: multer.memoryStorage() });
const fs = require('fs');
const { body, validationResult } = require('express-validator/check');

//Modulos propios
const middlewares = require("./middlewares");
const controlAcceso = middlewares.controlAcceso;
const saUsers = require("./business/saUsers");

//Expresiones regulares para parseo de campos:
	
	//Desde el principio del string hasta el final solo aceptamos caracteres alfanumericos
	const expresionPass = /^\w+$/;

	/*
	Al principio del string 1 o mas caracteres alfanumericos, una @, 
	1 o mas caracteres alfanumericos, un punto y 1 o mas caracteres alfanumericos.
	*/
	const expresionEmail = /^\w+(@){1}\w+(\.){1}\w+$/
	const expresionName = /^[A-Z]{1}[a-zA-Z\s]+$/


const userRouter = express.Router();

//Definicion de manejadores
userRouter.get('/login', function(request, response){
	response.render("login", {errors: null})
})

userRouter.post('/doLogin', [
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
	}, request.body.pass, function(cod, err, content){
		switch(cod){
			case 0:
				request.session.currentUser = content;
				response.locals.currentUser = request.session.currentUser;
				response.redirect("/users/profile/"+request.session.currentUser.id);	
				break;
			case -1:
			case -2:
			case -3:
			case -5:
				response.render("login.ejs", {errors: [{msg: err}]	});
				break;
			default:
				response.redirect("/users/login");
				break;
		}
		response.end();
	});
});

userRouter.get('/new_user', function(request, response){
	response.render("new_user.ejs",{errors:null})
});

userRouter.post('/addUser', multerFactory.single("image"), [
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

	saUsers.addUser(user,function(code,err){
		switch(code){		
		case -1:
			response.render("new_user.ejs",{errors: [{msg: err}]} );
			break;
		default:
			response.redirect("/users/login");
			break
		}
	})
	
})

userRouter.get('/friends', controlAcceso, function(request, response){
	saUsers.getFriends(request.session.currentUser.id,  function(friends){
		saUsers.getPendingFriendRequest(request.session.currentUser.id,(err,friendRequest)=>{
			response.render("friends.ejs", {friendRequest:friendRequest, friends: friends});
		})
	});
});

userRouter.post("/answerRequest", controlAcceso, (request,response)=>{
	saUsers.confirmRequest(request.body.id,request.session.currentUser.id,request.body.botonSolicitud=="Aceptar",(err)=>{
		response.redirect("/users/friends");
	})
})

userRouter.get('/profile/:id', controlAcceso, function(request, response){
	saUsers.getUserData(request.params.id,(err,user)=>{
		response.render("profile.ejs",{user:user,ownProfile:request.params.id == request.session.currentUser.id});
	})
});

userRouter.get('/modify_user', controlAcceso, (request,response)=>{
	response.render("modify_user.ejs",{user:request.session.currentUser,errors:null});
})

userRouter.post("/doModify", controlAcceso, multerFactory.single("image"), [
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

	saUsers.modifyUser(request.session.currentUser.id,user,(cod, err, userMod)=>{
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

userRouter.get('/disconnect', function(request, response){
	request.session.destroy();
	response.redirect("/users/login");
})

userRouter.get("/getUserImage/:email", function(request, response){
	let email = request.params.email;
	saUsers.getImage(email, function(cod, image){
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

userRouter.get("/searchFriend",controlAcceso,(request,response)=>{
	saUsers.searchByName(request.query.name,request.session.currentUser.id,(err,list)=>{
		response.render("search.ejs",{list:list});
	});
})

userRouter.post("/sendFriendRequest",controlAcceso,(request,response)=>{
	saUsers.sendFriendRequest(request.session.currentUser.id,request.body.id,(err)=>{
		response.redirect("/users/friends");
	})
})

module.exports = userRouter;