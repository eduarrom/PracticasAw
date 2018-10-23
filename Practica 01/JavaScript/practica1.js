var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(express.static('../'));

app.listen(3000, function () {
  console.log('Practica 1 en el puerto 3000');
});

var login = require('./login.js');

app.post('/login', function (req, res) {
	if (login.parsePass(req.body.pass)){
		login.getUsers(req.body.email, req.body.pass, function(err, rows){
			if (err) {
				throw err;
			}
			
			if (rows.length == 0){
				res.redirect("/login.html")
			} else if (rows[0].password != req.body.pass) {
				res.redirect("/login.html")
			} else {
				res.redirect("/friends.html")
			}
			return rows;
		})
	} else {

		res.redirect("/login.html")
	}

});