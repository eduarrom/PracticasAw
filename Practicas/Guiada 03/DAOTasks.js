'use strict'

class DAOTasks {
    constructor(pool) {
        this.pool = pool;
    }

    getAllTasks(email, callback) {
        this.pool.getConnection(function(err, connection){
            if(err){
                callback("Error de conexion a la base de datos", null);
            }else{
                connection.query(
                    "select * from task left join tag on tag.taskId = task.id where task.user = ? order by task.id",
                    [email],
                    function(err, rows){
                        connection.release();
                        if(err){
                            callback("Error de acceso a la base de datos",null)
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
                callback("Error de conexion a la base de datos", null);
            }else{
                connection.query(
                    "insert into task (user,text,done) values (?,?,?)",
                    [email,task.text,task.done],
                    function(err, rows){
                        if(err){
                            callback("Error de acceso a la base de datos",null)
                        } else {
                            let query = "insert into tag (taskId, tag) values "
                            let primera = true;
                            let taskTag = [];
                            task.tags.forEach(function(e){
                                taskTag.push(rows.insertId, e);            
                                if (primera == false){
                                    query += ",";
                                }
                                query += "(?,?)"
                                primera = false;
                            })
                            connection.query(
                                query,
                                taskTag,
                                function(err, rows){
                                    connection.release();
                                    if(err){
                                        callback("Error de acceso a la base de datos",null)
                                    } else {
                                        callback(null)
                                    }
                                }
                            )
                            
                        }
                    }
                )
            }
        })
    }

    markTaskDone(idTask, callback) {
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(err("Error de conexion a la base de datos"), null);
            }else{
                connection.query(
                    "update task set done = 1 where id = ?",
                    [idTask],
                    function(err, rows){
                        connection.release();
                        if(err){
                            callback("Error de acceso a la base de datos",null)
                        } else {
                            callback(null);
                        }
                    }
                )
            }
        })   
    }

    deleteCompleted(email, callback) {
        
    }
}

module.exports = DAOTasks;
   