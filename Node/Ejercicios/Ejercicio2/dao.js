var mysql = require('mysql');

var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "contactos"
});

function insertarUsuario(usuario, callback){
    pool.getConnection(function(err, connection) {
        if (err) {
            callback("Error al obtener la conexion")
        } else {
            connection.query(
                "insert into usuarios (nombre, correo, telefono) values (?,?,?)",
                [usuario.nombre, usuario.correo, usuario.telefono],
                function(err, filas){
                    connection.release();
                    if (err){
                        callback("Error en la insercion del usuario")
                    } else {
                        callback(null);
                    }
                }
            )
        }
    });
}

function enviarMensaje(usuarioOrigen, usuarioDestino, mensaje, callback){
    pool.getConnection(function(err, connection) {
        if (err) {
            callback("Error al obtener la conexion")
        } else {
            connection.query(
                "insert into mensajes (idOrigen, idDestino, mensaje, hora, leido) values (?,?,?,UTC_TIMESTAMP(),?)",
                [usuarioOrigen, usuarioDestino, mensaje, false],
                function(err, filas){
                    connection.release();
                    if (err){
                        callback("Error en la creacion del mensaje")
                    } else {
                        callback(null);
                    }
                }
            )
        }
    });
}

function bandejaEntrada(usuario, callback){
    pool.getConnection(function(err, connection) {
        if (err) {
            callback("Error al obtener la conexion", null)
        } else {
            connection.query(
                "select * from mensajes m, usuarios u where m.leido = false and u.correo = ?",
                [usuario.correo],
                function(err, filas){
                    connection.release();
                    if (err){
                        callback("Error en el acceso a la bandeja de entrada", null)
                    } else {
                        callback(null, filas);
                    }
                }
            )
        }
    });
}

function buscarUsuarios(str, callback){
    pool.getConnection(function(err, connection) {
        if (err) {
            callback("Error al obtener la conexion", null)
        } else {
            str = "%" + str + "%";
            connection.query(
                "select * from usuarios where nombre like ?",
                [str],
                function(err, filas){
                    connection.release();
                    if (err){
                        callback("Error en el acceso a los usuarios", null)
                    } else {
                        callback(null, filas);
                    }
                }
            )
        }
    });
}

function terminarConexion(callback){
    try{
        pool.end();
    } catch (e) {
        callback("Error al cerrar el pool");
    }
    callback(null);
}

module.exports = {
    insertarUsuario: insertarUsuario,
    enviarMensaje: enviarMensaje,
    bandejaEntrada: bandejaEntrada,
    buscarUsuarios: buscarUsuarios
}