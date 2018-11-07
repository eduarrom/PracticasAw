var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "contactos"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

function insertarUsuario(usuario, callback){
    con.query(
        "insert into usuarios (nombre, correo, telefono) values (?,?,?)",
        [usuario.nombre, usuario.correo, usuario.telefono],
        function(err, filas){
            if (err){
                callback("Error en la insercion del usuario")
            } else {
                callback(null);
            }
        }
    )
}

function enviarMensaje(usuarioOrigen, usuarioDestino, mensaje, callback){
    con.query(
        "insert into mensajes (idOrigen, idDestino, mensaje, hora, leido) values (?,?,?,UTC_TIMESTAMP(),?)",
        [usuarioOrigen, usuarioDestino, mensaje, false],
        function(err, filas){
            if (err){
                callback("Error en la creacion del mensaje")
            } else {
                callback(null);
            }
        }
    )
}

function bandejaEntrada(usuario, callback){
    con.query(
        "select * from mensajes m, usuarios u where m.leido = false and u.correo = ?",
        [usuario.correo],
        function(err, filas){
            if (err){
                callback("Error en el acceso a la bandeja de entrada", null)
            } else {
                callback(null, filas);
            }
        }
    )
}

function buscarUsuarios(str, callback){
    con.query(
        "select * from usuarios where nombre like ?",
        [str],
        function(err, filas){
            if (err){
                callback("Error en el acceso a los usuarios", null)
            } else {
                callback(null, filas);
            }
        }
    )
}

function terminarConexion(callback){
    try{
        con.end();
    } catch (e){
        callback("Error al cerrar la conexion");
    }
    callback(null);
}

module.exports = {
    insertarUsuario: insertarUsuario,
    enviarMensaje: enviarMensaje,
    bandejaEntrada: bandejaEntrada,
    buscarUsuarios: buscarUsuarios
}