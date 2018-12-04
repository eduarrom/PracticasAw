class DaoQuestion{
    
    constructor(){
		this.pool = require("./pool");
	}


    addQuestion(question,userId,callback){
        this.pool.getConnection((err,connection)=>{
            
            if(err) callback(new Error("Error al obtener la conexion"));
            else
                connection.query("insert into questions (text,questioner) VALUES (?,?);",[question.text,userId],(err,info)=>{
                    
                    if(err) callback(new Error("Error al introducir una nueva pregunta"));
                    else {
                        let query = "insert into possibleAnswers (number, question, answer) values ";
                        let parameters = [];

                        for(let i = 0; i<question.possibleAnswers.length;i++){
                            
                            if (i == 0){
                                query += "(?,?,?)";
                            } else {
                                query += ", (?,?,?)";
                            }

                            parameters.push(i+1);
                            parameters.push(info.insertId);
                            parameters.push(question.possibleAnswers[i]);
                        }
                        query += ";";

                        connection.query(query,parameters,(err)=>{

                            connection.release();

                            if(err) callback("Error al insertar las posibles respuestas");
                            else callback(null);
                        })
                    }
                })
        })
    }


    getRandomQuestions(maxQuestions=5,callback){
        this.pool.getConnection((err,connection)=>{
            
            if(err) callback(new Error("Error al obtener la conexion"));
            else
                connection.query("SELECT * FROM `questions` ORDER by rand() limit ?;",[maxQuestions],(err,lista)=>{

                    connection.release();

                    if(err) callback(new Error("Error al obtener preguntas aleatorias"),null);
                    else callback(null,lista);
                })
        });
    }
    
    //si respondes por ti mismo, supplanted = userId
    answerQuestion(questionId, answer, userId, supplanted,callback){
       
        this.pool.getConnection((err,connection)=>{
            
            if(err) callback(new Error("Error al obtener la conexion"));
            else
                connection.query("insert into answers (respondent,choosen,supplanted,question) values (?,?,?,?)",
                [userId,answer,supplanted,questionId],(err)=>{

                    connection.release();

                    if(err) callback(new Error("Error al responder pregunta"));
                    else    callback(null);
                });
        });
    }

    getQuestion(questionId,userId,callback){

        this.pool.getConnection((err,connection)=>{

            if(err) callback(new Error("Error al obtener la conexion"));
            else
                connection.query("select * from questions where id = ?;",[questionId],(err,questions)=>{
                    if(err || questions == null || questions.length == 0){
                        connection.release();
                        callback(new Error("Error al obtener la pregunta"),null);
                    }
                    else{
                        connection.query("select number,question,answer from possibleanswers where question = ? UNION select number,question,answer from customanswers where question = ? and user = ? order by rand()",[questionId,questionId,userId],(err,answers)=>{
                            connection.release();
                            if(err){
                                callback(new Error("Error al obtener las posibles respuestas"),null);
                            }else
                                callback(null,{question:questions[0],possibleAnswers:answers});
                        })

                    }
                })
        })
    }

    getAnswers(questionId,callback){
        this.pool.getConnection((err,connection)=>{
            if(err) callback(new Error("Error al obtener la conexion"));
            else
            connection.query("SELECT u.id, u.email, u.name, p.answer FROM answers a LEFT JOIN questions q ON q.id = a.question LEFT JOIN users u ON u.id = a.user LEFT JOIN possibleanswers p ON p.question = a.question AND p.number = a.answer WHERE a.question = ?;",[questionId],((err,result)=>{
                connection.release();
                if(err) callback(new Error("Error al obtener quien ha respondido"),null);
                else callback(null,result);
            }));
        })
    }

   getGuessed(questionId,userId,callback){
       this.pool.getConnection((err,connection)=>{
            if(err) callback(new Error("Error al obtener la conexion"));
            else connection.query("SELECT a.respondent, a.supplanted, u.name, u.email, a.choosen, a2.choosen as originalanswer FROM answers a JOIN users u on u.id = supplanted JOIN answers a2 on a2.respondent = a2.supplanted and a2.respondent = a.supplanted and a.question = a2.question WHERE ((a.respondent != ? and a.respondent = a.supplanted) or (a.respondent = ?)) and a.question = ? ORDER BY a.supplanted",[userId,userId,questionId],(err,result)=>{

                connection.release();

                if(err) callback(new Error("Error al obtener quien ha respondido"),null);
                else{
                    let usuarios = new Map();

                    result.forEach(usuario => {
                        if (usuario.respondent == userId){ 
                            usuarios.set(usuario.supplanted,{
                                id:usuario.supplanted,
                                name:usuario.name,
                                responsed: true,
                                email:usuario.email,
                                guessed: usuario.choosen == usuario.originalanswer
                            })
                        } else  if (usuario.respondent != userId && usuarios.get(usuario.supplanted) == undefined){
                            usuarios.set(usuario.supplanted,{
                                id:usuario.supplanted,
                                name:usuario.name,
                                responsed: false,
                                email:usuario.email,
                                guessed: false
                            })
                        }
                    })

                    callback(null,Array.from(usuarios.values()));
                }

            })
       })
   }

   addAnswer(number,question,text,userId,callback){
       this.pool.getConnection((err,connection)=>{
           
            if(err) callback(new Error("Error al obtener la conexion"));
           
            else connection.query("insert into customanswers (number, user, question, answer) values (?,?,?,?);",
                [number,userId,question,text],(err)=>{

                    connection.release();

                    if(err) callback(new Error("Error al insertar una nueva respuesta"));
                    else callback(null);
                })
       })
   }

   getAnswer(questionId,userId,callback){
    this.pool.getConnection((err,connection)=>{
           
        if(err) callback(new Error("Error al obtener la conexion"));
        
        else connection.query("select * from answers where respondent = supplanted and respondent = ? and question = ?;",
        [userId,questionId],(err,result)=>{

            connection.release();

            if(err) callback(new Error("Error al obtener respuesta"));
            else callback(null,result[0]);
        });
    });
    }

}

module.exports = DaoQuestion;