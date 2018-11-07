let fs = require('fs');

function freplace(fichero, buscar, sustituir, callback){
        fs.readFile(fichero, { encoding : "utf-8" } , function(err, contenido){
            if(err){
                callback("Error al leer el fichero");
            }fs.writeFile( fichero, contenido.replace(buscar, sustituir) , function(err, contenido){
                    if(err){
                        callback("Error al escribir el fichero");
                    } else {
                        callback(null);
                    }
                });
            }      
        });
}

function freplaceb(fichero, buscar, sustituir, callback = function(err){
		if (err != null) {
			console.log(err);
		} else {
			console.log("Fichero escrito correctamente");
		}
	})
	{
        fs.readFile(fichero, { encoding : "utf-8" } , function(err, contenido){
            if(err){
                callback("Error al leer el fichero");
            } else {
                fs.writeFile( fichero, contenido.replace(buscar, sustituir) , function(err, contenido){
                    if(err){
                        callback("Error al escribir el fichero");
                    } else {
						callback(null);
                    }
                });
            }      
        });
}

module.exports = {
    freplace: freplace,
	freplaceb: freplaceb
}	