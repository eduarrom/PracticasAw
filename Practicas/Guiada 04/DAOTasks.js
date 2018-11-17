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
                            let tareasInsertadas = 0;
                            rows.forEach(function(e){
                                if (tareas[tareasInsertadas - 1] != null && tareas[tareasInsertadas - 1].id == e.id){
                                    tareas[tareasInsertadas - 1].tags.push(e.tag);
                                } else {
                                    tareas.push({
                                        id: e.id,
                                        text: e.text,
                                        done: e.done,
                                        tags: [e.tag]
                                    });
                                    if(tareas[tareasInsertadas].tags[0]==null) tareas[tareasInsertadas].tags=[];
                                    tareasInsertadas++;
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
                let tarea = parsearTarea(task);
                connection.query(
                    "insert into task (user,text,done) values (?,?,?)",
                    [email,tarea.text,task.done],
                    function(err, rows){
                        if(err){
                            callback(new Error("Error de acceso a la base de datos"),null)
                        } else {
                            let ret = crearQuery(tarea,rows.insertId);

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
            connection.query("DELETE FROM task WHERE user = ? and done = 1;",[email],(err)=>{
                
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

function parsearTarea(task){
    let tarea = {
		text: "",
		tags: []
    };
    
    let expresionTags = /@(\w*)/g;

    let texto = task.text;

	let tags = texto.match(expresionTags);
	
	tarea.text = texto.replace(expresionTags, "").trim().replace(/\s+/g, " ");

    if(tags != null && tags.length>0) tags.map( t => tarea.tags.push(t.replace(/@/, "")));
    
    return tarea;
}

module.exports = DAOTasks;
   