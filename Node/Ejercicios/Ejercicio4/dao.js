var mysql = require('mysql');

var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "contactos"
});

function leerArticulos(callback){
    pool.getConnection(function(err, connection){
        if (err){
            callback("Error al establecer la conexion a la BBDD", null);
        } else {
            connection.query(
                "select a.id, a.titulo, a.fecha, p.palabraClave from articulos a left join palabrasclave p on a.id = p.idArticulo order by a.id",
                function(err, filas){
                    if (err){
                        callback("Error al acceder a la lista de articulos", null);
                    } else {
                        let articulos = [];

                        filas.forEach(e =>{
                            if (articulos.length < e.id){
                                articulos.push({
                                    id: e.id,
                                    titulo: e.titulo,
                                    fecha: Date(e.fecha),
                                    palabrasClave: [e.palabraClave]
                                });
                            } else {
                                articulos[e.id - 1].palabrasClave.push(e.palabraClave);
                            }
                        }
                        )
                        
                        callback(null, articulos);
                    }
                }
            )
        }
    })
}

module.exports = {
    leerArticulos: leerArticulos,
}