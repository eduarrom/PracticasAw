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
    
    //si no responde por nadie, por defecto responde por si mismo
    answerQuestion(questionId, answer, userId, supplanted=userId,callback){
       
        this.pool.getConnection((err,connection)=>{
            
            if(err) callback(new Error("Error al obtener la conexion"));
            else
                connection.query("insert into answers (respondent,answer,supplanted,question) values (?,?,?,?)",
                [userId,answer,supplanted,questionId],(err)=>{

                    connection.release();

                    if(err) callback(new Error("Error al responder pregunta"));
                    else    callback(null);
                });
        });
    }

    getQuestions(questionId,callback){

        this.pool.getConnection((err,connection)=>{

            if(err) callback(new Error("Error al obtener la conexion"));
            else
                connection.query("select * from questions where id = ?;",[questionId],(err,question)=>{
                    if(err || question == null || question.length == 0){
                        connection.release();
                        callback(new Error("Error al obtener la pregunta"),null);
                    }
                    else{
                        connection.query("select * from possibleanswers where question = ?",[questionId],(err,answers)=>{
                            connection.release();
                            if(err){
                                callback(new Error("Error al obtener las posibles respuestas"),null);
                            }else
                                callback(null,{question:question,possibleAnswers:answers});
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
/*
    getAnswers(questionId,callback){
        this.pool.getConnection((err,connection)=>{
            if(err) callback(new Error("Error al obtener la conexion"));
            else
            connection.query("select name,users.id,choosen,supplanted from users,answers where respondent = users.id and question = ?;",[questionId],((err,result)=>{
                connection.release();
                if(err) callback(new Error("Error al obtener quien ha respondido"),null);
                else callback(null,result);
            }));
        })
    }
    */
}

module.exports = DaoQuestion;