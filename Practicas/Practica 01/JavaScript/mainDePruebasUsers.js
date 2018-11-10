
let DAO = require("daoUsers");

let parser = require("parser");

let pool = require("mysql").createPool({
	host: "localhost",
	user: "root",
	password: "1234",
	database: "facebluff"
  });

let dao = new DAO(pool);

let user1 = {
    email:"c@ucm.es",
    password:"12345678",
    name:"carlos",
    gender:"hombre",
    birthdate:new Date(),
    image:""
}

let user2 = {
    email:"e@ucm.es",
    password:"12345678",
    name:"edu",
    gender:"hombre",
    birthdate:new Date(),
    image:""
}

if(parser.parseUser(user1)){
    dao.addUser(user1,(err)=> {
        
            if(err) console.log(err);
            else console.log("Usuario creado correctamente")
        
        
    });
} else {
    console.log("Formato de usuario incorrecto");
}

if(parser.parseUser(user2)){
    dao.addUser(user2,(err)=> {
        
            if(err) console.log(err);
            else console.log("Usuario creado correctamente")
        
        
    });
} else {
    console.log("Formato de usuario incorrecto");
}

dao.sendFriendRequest(1,12,(err)=>{
    if(err) console.log(err);
    else console.log("Peticion enviada correctamente");
});

dao.getFriends(2,(err,lista)=>{
    if(err) console.log(err);
    else console.log(lista);
});

dao.getFriends(1,(err,lista)=>{
    if(err) console.log(err);
    else console.log(lista);
});

dao.getPendingFriendRequest(2,(err,lista)=>{
    if(err) console.log(err);
    else console.log(lista);
});

dao.getPendingFriendRequest(1,(err,lista)=>{
    if(err) console.log(err);
    else console.log(lista);
});


dao.confirmRequest(1,12,true,(err)=>{if(err)console.log(err)});

