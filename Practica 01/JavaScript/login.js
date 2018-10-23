var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "facebluff"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

exports.getUsers = function(user, pass, callback) {
	return getUsers(user, pass, callback);
}

exports.parsePass = function(pass) {
	return parsePass(pass);
}

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
	con.query("SELECT * FROM users where email = '" + email + "'", function (err, rows, fields) {
		if (err) {
			callback(err, null)
		} else {
			callback(null, rows)
		}
	})

}





