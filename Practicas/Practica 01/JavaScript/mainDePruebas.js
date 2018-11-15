
let DAO = require("daoUsers");
let PreguntasDao = require("daoQuestions");

let parser = require("parser");

let pool = require("mysql").createPool({
	host: "localhost",
	user: "root",
	password: "",
	database: "facebluff"
  });

let dao = new DAO(pool);
let preguntasDao = new PreguntasDao(pool);

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
/*
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
dao.sendFriendRequest(1,2,(err)=>{
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

preguntasDao.addQuestion("¿como me llamo?",["Carlos","Edu","Jose"],1,(err)=>{
    if (err) console.log(err);
    else console.log("Pregunta añadida correctamente");
})

preguntasDao.getRandomQuestions(1,(err,lista)=> console.log(lista));
preguntasDao.getRandomQuestions(1,(err,lista)=> console.log(lista));
preguntasDao.getRandomQuestions(2,(err,lista)=> console.log(lista));
*/

preguntasDao.answerQuestion({questionId:4, answer:1,userId:1,callback: (err)=>{ 
    if(err) console.log(err);
    else console.log("pregunta respondida correctamente");
}});
