var mysql = require('mysql');

var pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "1234",
	database: "facebluff"
  });

function parsePass(pass){
	if (pass == undefined){
		return false;
	}
	
	if (pass.length < 8){
		return false;
	}
	
	return true;	
}

function getUsers(email, pass, callback){
	pool.getConnection(function(err, connection) {
        if (err) {
            callback("Error al obtener la conexion")
        } else {
			connection.query(
				"SELECT * FROM users where email = ?",
				[email],
				function(err, rows) {
				connection.release()
				if (err) {
					callback("Error al obtener los usuarios", null)
				} else {
					callback(null, rows)
				}
			})
		}
	})
}

function addUser(user,callback){
	pool.getConnection((err,connection)=>{
		
		if(err) callback("Error al obtener la conexion");

		else
			connection.query("insert into users (email,password,name,gender,birthdate,image) values (?,?,?,?,?,?)",
			[user.email,user.password,user.name,user.gender,user.birthdate,user.image],(err,info)=>{
				
				connection.release();

				if(err) callback("error al introducir nuevo usuario");
				else{
					user.id = info.insertId;
					callback(null);
				}
			});
	})
}

function findByName(name,callback){
	pool.getConnection((err,connection)=>{

		if(err) callback("Error al obtener la conexion");

		else
			connection.query("select * from users where name = ?",[name],(err,result)=>{
				
				connection.release();

				if(err) callback("Error al obtener usuarios por nombre",null);
				else callback(null,result);
			})
	})
}

function sendFriendRequest(originUser,destinationUser){
	pool.getConnection((err,connection)=>{

		if(err) callback("Error al obtener la conexion");

		else 		//status -> 0=sin responder, 1=aceptada, 2=rechazada
		connection.query("insert into friendRequests (originUser,destinationUser,state) values (?,?,0)",
		[originUser.id,destinationUser.id],(err)=>{
			
			connection.release();

			if(err) callback("Error al enviar solicitud");
			else callback(null);
		});
	})
}

module.exports = {
	getUsers: getUsers,
	parsePass: parsePass,
	addUser: addUser,
	findByName:findByName,
	sendFriendRequest: sendFriendRequest
}





