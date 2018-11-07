const http = require('http');
const fs = require('fs');
var modurl = require('url'); 

const dao = require('../Ejercicio2/dao.js');

const servidor = http.createServer(function(request, response){
    const method = request.method;
    const url = modurl.parse(request.url,true);
    const pathname = url.pathname;
    const query = url.query;

    if (method == "GET"){
        switch(pathname){
            case "/index.html":
                fs.readFile("./index.html", function(err, resp){
                    if (err){
                        response.writeHead(404);
                        response.write("El contenido no existe")
                    } else {
                        response.writeHead(200, { 'Content-Type': 'text/html' });
                        response.write(resp);
                    }
                    response.end();
                })
                break;
            case "/nuevo_usuario":
                dao.insertarUsuario(query, function(err){
                    if(err){
                        response.writeHead(400);
                        response.write(err.message);
                    } else{
                        response.writeHead(200, { 'Content-Type': 'text/html' });
                        response.write("Usuario insertado correctamente");
                    }
                    response.end();
                })
                break;
            default:
                response.statusCode= 404;
        }
    }
});

servidor.listen(3000, function(err){
    if(err){
        console.log("Error al iniciar el servidor en el puerto 3000")
    } else {
        console.log("Servidor escuchando en el puerto 3000")
    }
});