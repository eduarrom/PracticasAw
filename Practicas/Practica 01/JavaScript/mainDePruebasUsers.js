
let DAO = require("daoUsers");

let pool = require("mysql").createPool({
	host: "localhost",
	user: "root",
	password: "",
	database: "facebluff"
  });

let dao = new DAO(pool);

let user1 = {
    email:"c@ucm.es",
    password:"123",
    name:"carlos",
    gender:"hombre",
    birthdate:new Date(),
    image:""
}

let user2 = {
    email:"e@ucm.es",
    password:"222",
    name:"edu",
    gender:"hombre",
    birthdate:new Date(),
    image:""
}
/*
dao.addUser(user1,(err)=> {
    if(err) console.log(err);
    else console.log("usuario creado correctamente")
    }
);

dao.addUser(user2,(err)=> {
    if(err) console.log(err);
    else console.log("usuario creado correctamente")
    }
);

dao.sendFriendRequest(1,2,(err)=>{
    if(err) console.log(err);
    else console.log("peticion enviada correctamente");
});
*/

