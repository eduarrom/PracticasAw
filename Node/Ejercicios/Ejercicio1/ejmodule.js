let fs = require('fs');

function freplace(fichero, buscar, sustituir, callback){
        fs.readFile(fichero, { encoding : "utf-8" } , function(err, contenido){
            if(err){
                callback("Error al leer el fichero");
            } else {
                console.log("Fichero leido correctamente");
                fs.writeFile( fichero, contenido.replace(buscar, sustituir) , function(err, contenido){
                    if(err){
                        callback("Error al escribir el fichero");
                    } else {
                        console.log("Fichero escrito correctamente");
                        callback(null);
                    }
                });
            }      
        });
}

module.exports = {
    freplace: freplace
}