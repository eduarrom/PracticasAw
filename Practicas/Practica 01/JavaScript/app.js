//Definicion de modulos externos
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressSession = require("express-session");
const expressMySqlSession = require("express-mysql-session");
const multer = require("multer");
const inputParser = require('input-parser');

//Definicion de modulos creados
const config = require("./config");
const saUsers = require('saUsers');

const pool = mysql.createPool(config.mysqlConfig);

const MySqlStore = expressMySqlSession(expressSession);
const sessionStore = new MySqlStore(config.mysqlConfig);

//const multerFactory = multer({dest: path.join(__dirname, "../public/images","users")} );

const multerFactory = multer({ storage: multer.memoryStorage() });

var app = express();

//Usar bodyParser para obtener los atributos pasados por post
app.use(bodyParser.urlencoded({extended:false}));

//Usar cookieParser para analizar y obtener las cookies
app.use(cookieParser());

//Usar el directorio public para los directorios estaticos
app.use(express.static(path.join(__dirname, "../public")));

//Usar ejs y el directorio views de public para las paginas dinamicas
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "../public", "views"))

app.use(expressSession({resave:false, saveUninitialized:false, secret:"foobar34", store:sessionStore}));

app.listen(3000, function () {
  console.log('Practica 1 en el puerto 3000');
});

function controlAcceso(request, response, next){
    if (request.session.currentUser != null){
        response.locals.currentUser = request.session.currentUser;
        next();
    } else {
        response.redirect("/login");
    }
}

app.get('/', controlAcceso, function(request, response){
	response.redirect("/friends");
})

app.get('/login', function(request, response){
	response.render("login", {error: null})
})

app.post('/doLogin', inputParser.loginParser, function (request, response) {
	saUsers.doLogin({
		email: request.body.email,
		name: null,
		gender: null,
		years: null,
		image: null,
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
				response.render("login.ejs", {error: err});
				break;
			default:
				response.redirect("/login");
				break;
		}
		response.end();
	});
});

app.get('/new_user', function(request, response){
	response.render("new_user.ejs",{error:null})
});

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

app.get('/my_profile', controlAcceso, function(request, response){
	response.render("my_profile.ejs")
});

app.post('/addUser', multerFactory.single("image"), inputParser.newUserParser, function(request, response){
	let user = {
		email: request.body.email,
		name: request.body.name,
		password: request.body.pass,
		gender: request.body.gender,
		birthdate: request.body.birth
	}
	
	if(request.file == null) user.image=null;
	else user.image = request.file.buffer;

	saUsers.addUser(user,pool,function(code,err){
		switch(code){		
		case -5:
		case -1:
			response.render("new_user.ejs",{error:err});
			break;
		default:
			response.redirect("/login");
			break
		}
	})
})

app.get('/modify_user', controlAcceso, (request,response)=>{
	response.render("modify_user.ejs",{user:request.session.currentUser,error:null});
})

app.post("/doModify", controlAcceso, multerFactory.single("image"), inputParser.modifyUserParser, (request,response)=>{
	let user = {
		email: request.body.email,
		name: request.body.name,
		password: request.body.password,
		gender: request.body.gender,
		birthdate: request.body.birth,
		points: request.session.currentUser.points
	}
	
	if (request.body.deleteImage){
		user.image = null;
	} else {
		if(request.file == null){
			user.image=request.session.currentUser.image;
		} else {
			user.image = request.file.filename;
		}
	}

	saUsers.modifyUser(request.session.currentUser.id,user,request.body.imageCheck,pool,(cod, err, userMod)=>{
		switch(cod){
			case 0: 
				request.session.currentUser = userMod;
				response.locals.currentUser = request.session.currentUser;
				response.redirect("my_profile");
				break;
			case -5:
			case -1:
				response.render("modify_user.ejs",{user:request.session.currentUser,error:err});
				break;
		}		
	})
})

app.get('/disconnect', function(request, response){
	request.session.destroy();
	response.redirect("/login");
})

app.get("/getImageCurrentUser", function(request, response){
	response.end(new Buffer(request.session.currentUser.image));
})


app.use(function(request, response, next){
	response.render("404.ejs",{currentUser:request.session.currentUser});
})