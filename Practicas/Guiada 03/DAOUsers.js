let mysql = require('mysql');

class DAOUsers{

    constructor(pool){
        this.pool = pool;
    }

    isUserCorrect(email, password, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback("Error de conexion a la base de datos", null);
            }else{
                connection.query(
                    "select * from user where email = ? and password = ?",
                    [email, password],
                    function(err, rows){
                        connection.release();
                        if(err){
                            callback("Error de acceso a la base de datos",null)
                        } else {
                            if (rows.length != 1){
                                callback(null, false);
                            } else {
                                callback(null, true);
                            } 
                        }
                    }
                )
            }
        })
    }

    getUserImageName(email, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback("Error de conexion a la base de datos", null);
            }else{
                connection.query(
                    "select * from user where email = ?",
                    [email],
                    function(err, rows){
                        connection.release();
                        if(err){
                            callback("Error de acceso a la base de datos", null)
                        } else {
                            if (rows.length != 1){
                                callback("No existe el usuario", null);
                            } else {
                                callback(null, rows[0].img);
                            } 
                        }
                    }
                )
            }
        })
    }
}

module.exports = DAOUsers;

