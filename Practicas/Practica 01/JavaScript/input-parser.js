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

function parsePass(pass){

	text = "";	
	
	if (pass == ""){
		text += "\n- La contraseña no puede dejarse en blanco.";
	} else if (pass.length < 8){
		text += "\n- La contraseña debe tener al menos una longitud de 8.";
	} else if (!expresionPass.test(pass)){
		text += "\n- La contraseña tiene un formato no valido.";
	}

	return text;	
}

function parsePassMod(pass){
	
	text = "";

	if (pass.length != ""){
		if (pass.length < 8){
			text += "\n- La contraseña debe tener al menos una longitud de 8.";
		} else if (!expresionPass.test(pass)){
			text += "\n- La contraseña tiene un formato no valido.";
		}
	}

	return text;	
}

function parseEmail(email){

	text = "";

	if (email == ""){
		text+="\n- El email no puede dejarse en blanco."
	} else if (!expresionEmail.test(email)){
		text+="\n- El email tiene un formato no valido (Ej:usuario@servidor).";
	}

	return text;	
}

function parseName(name){

	text = "";

	if (name == ""){
		text+="\n- El nombre no puede dejarse en blanco.";
	} else if (!expresionName.test(name)){
		text+="\n- El nombre tiene un formato no valido.";
	}

	return text;
}

function newUserParser(request, response, next){
	let error = "";

	error += parseEmail(request.body.email) 
	error += parsePass(request.body.pass) 
	error += parseName(request.body.name)

	if (error.length == 0){
		next();
	} else {
		response.render("new_user.ejs", {error: error})
	}	
}

function modifyUserParser(request, response, next){
	let error = "";

	error += parseEmail(request.body.email) 
	error += parsePassMod(request.body.password) 
	error += parseName(request.body.name)

	if (error.length == 0){
		next();
	} else {
		response.render("modify_user.ejs", {user:request.session.currentUser, error: error})
	}
}

function loginParser(request, response, next){
	let error = "";

	error += parseEmail(request.body.email) 
	error += parsePass(request.body.pass) 

	if (error.length == 0){
		next();
	} else {
		response.render("login.ejs", {error: error})
	}
}

module.exports = {
	loginParser:loginParser,
	modifyUserParser: modifyUserParser,
	newUserParser: newUserParser
}