const daoUsers = require('../integration/daoUsers');
const dateFormat = require('../dateFormat');

function doLogin(user, pass, callback){
    let daoUser = new daoUsers();	
	daoUser.getUser(user.email, function(err, rows){
		if (err) {
			callback(-5, err.message, null);
		} else {			
			if (rows.length == 0){
				callback(-1, "Usuario no encontrado", null);
			} else if (rows[0].password != pass) {
				callback(-2, "Contraseña incorrecta", null);
			} else {
				callback(0, "Login correcto", {
					id: rows[0].id,
					email: rows[0].email,
					name: rows[0].name,
					gender: rows[0].gender,
					birthdate: dateFormat.calculateDate(rows[0].birthdate),
					years: dateFormat.calculateAge(rows[0].birthdate),
					points: rows[0].points,
				})				
			}
		}
	})
}

function getFriends(id, callback){
	let daoUser = new daoUsers();
	daoUser.getFriends(id, function(err, friends){
		if (err){
			callback(null);
		} else {
			callback(friends);
		}
	})
}

function getPendingFriendRequest(id,callback){
	let daoUser = new daoUsers();
	daoUser.getPendingFriendRequest(id,(err,result)=>{
		if (result==null) callback(err,[]);
		else{
			callback(err,result);
		}
	});
}

function confirmRequest(originUserId,destinationUserId,accept,callback){
	let daoUser = new daoUsers();
	daoUser.confirmRequest(originUserId,destinationUserId,accept,function(err){
		if (err){
			callback(err);
		} else {
			callback(null);
		}
	}=
}

function addUser(newUserData,callback){
	let daoUser = new daoUsers();
	daoUser.addUser(newUserData,function(err, id){
		if (err){
			callback(-1, err.message, null)
		} else {
			callback(0, "Insercion correcta", {
				id: id,
				email: newUserData.email,
				name: newUserData.name,
				gender: newUserData.gender,
				birthdate: dateFormat.calculateDate(new Date(newUserData.birthdate)),
				years: dateFormat.calculateAge(new Date(newUserData.birthdate)),
				points: newUserData.points,
			})			
		}
	})
}

function modifyUser(userId,newUserData,callback){
	let daoUser = new daoUsers();
	daoUser.modifyUser(userId,newUserData,function(err){
		if (err){
			callback(-1, err.message, null)
		} else {
			callback(0, "Modificacion correcta", {
				id: userId,
				email: newUserData.email,
				name: newUserData.name,
				gender: newUserData.gender,
				birthdate: dateFormat.calculateDate(new Date(newUserData.birthdate)),
				years: dateFormat.calculateAge(new Date(newUserData.birthdate)),
				points: newUserData.points,
			})			
		}
	})
}

function getImage(email,  callback){
	let daoUser = new daoUsers();
	daoUser.getUserImage(email, function(err, rows){
		if (err){
			callback(-2, null)
		} else {
			if (rows.length == 0 || rows[0].image == null){
				callback(-1, null);	
			} else {
				callback(0, rows[0].image)
			}		
		}
	})
}

function searchByName(name,currentUserId,callback){
	let daoUser = new daoUsers();

	daoUser.findByName(name,currentUserId,function(err, result){
		if (err){
			callback(err,null);
		} else {
			callback(null,result);
		}
	})
}

function getUserData(id,callback){
	let daoUser = new daoUsers();

	daoUser.getUserData(id,(err,rows)=>{
		callback(0, {
			id: rows[0].id,
			email: rows[0].email,
			name: rows[0].name,
			gender: rows[0].gender,
			birthdate: dateFormat.calculateDate(rows[0].birthdate),
			years: dateFormat.calculateAge(rows[0].birthdate),
			points: rows[0].points,
		})		
	});
}

function sendFriendRequest(originUserId,destinationUserId,callback){
	let daoUser = new daoUsers();
	daoUser.sendFriendRequest(originUserId,destinationUserId,function(err){
		if(err){
			callback(err);
		} else {
			callback(null);
		}
	}
}

function getNotifications(userId, callback){
	let daoUser = new daoUsers();
	daoUser.getNotifications(userId, function(err, rows){
		if (err){
			callback(err, null);
		} else {
			let notFiltradas = [];
			rows.forEach(n =>{
				notFiltradas.push({
					id: n.id,
					email: n.email,
					name: n.name,
					question: n.question,
					resPro: n.resPro != null ? n.resPro : n.cusPro,
					resOtro: n.resOtro != null ? n.resOtro : n.cusOtro
				})
			})
			callback(null,notFiltradas);
		}
	})
}


module.exports = {
	doLogin: doLogin,
	getFriends: getFriends,
	getPendingFriendRequest:getPendingFriendRequest,
	confirmRequest:confirmRequest,
	addUser:addUser,
	modifyUser:modifyUser,
	getImage: getImage,
	searchByName:searchByName,
	getUserData:getUserData,
	sendFriendRequest:sendFriendRequest,
	getNotifications:getNotifications
}