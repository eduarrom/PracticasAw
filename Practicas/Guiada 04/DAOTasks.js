'use strict'

class DAOTasks {
    constructor(pool) {
        this.pool = pool;
    }

    getAllTasks(email, callback) {
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"), null);
            }else{
                connection.query(
                    "select * from task left join tag on tag.taskId = task.id where task.user = ? order by task.id",
                    [email],
                    function(err, rows){
                        connection.release();
                        if(err){
                            callback(new Error("Error de acceso a la base de datos"),null)
                        } else {
                            let tareas = [];
                            rows.forEach(function(e){
                                if (tareas.length < e.id){
                                    tareas.push({
                                        id: e.id,
                                        text: e.text,
                                        done: e.done,
                                        tags: [e.tag]
                                    });
                                } else {
                                    tareas[e.id - 1].tags.push(e.tag);
                                }
                            });
                            callback(null, tareas);
                        }
                    }
                )
            }
        })
    }

    insertTask(email, task, callback) {
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"), null);
            }else{
                connection.query(
                    "insert into task (user,text,done) values (?,?,?)",
                    [email,task.text,task.done],
                    function(err, rows){
                        if(err){
                            callback(new Error("Error de acceso a la base de datos"),null)
                        } else {
                            let ret = crearQuery(task,rows.insertId);

                            let taskTag = ret.taskTag;
                            let query = ret.query;
                            
                            if (taskTag.length == 0) {
                                connection.release();
                                callback(null);
                            }else{
                                connection.query(
                                    query,
                                    taskTag,
                                    function(err, rows){
                                        connection.release();
                                        if(err){
                                            callback(new Error("Error de acceso a la base de datos"),null)
                                        } else {
                                            callback(null)
                                        }
                                    }
                                )
                            }
                            
                        }
                    }
                )
            }
        })
    }


    markTaskDone(idTask, callback) {
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexion a la base de datos"), null);
            }else{
                connection.query(
                    "update task set done = 1 where id = ?",
                    [idTask],
                    function(err, rows){
                        connection.release();
                        if(err){
                            callback(new Error("Error de acceso a la base de datos"),null)
                        } else {
                            callback(null);
                        }
                    }
                )
            }
        })   
    }

    deleteCompleted(email, callback) {
        this.pool.getConnection((err,connection)=>{

            if(err) callback(new Error("Error de conexión a la base de datos"));
            else
            connection.query("DELETE FROM task WHERE user = ? and done = true;",[email],(err)=>{
                
                connection.release();
                
                if(err) callback(new Error("Error de acceso a la base de datos"));
                else
                    callback(null);
            })
        })
    }
}

function crearQuery(task,id){

    let query = "insert into tag (taskId, tag) values "
    let primera = true;
    let taskTag = [];
    task.tags.forEach(function(e){
        taskTag.push(id, e);            
        if (primera == false){
            query += ",";
        }
        query += "(?,?)"
        primera = false;
        })

    return {query:query,taskTag:taskTag};
}


module.exports = DAOTasks;
   