var dao = require("./dao.js")

dao.leerArticulos(function(err, articulos){
    if (err != null){
        console.log(err.message);
    } else {
        if(articulos.length > 0){
            articulos.forEach(e => {
                console.log(JSON.stringify(e, null, 4));
            });
        } else {
            console.log("No hay articulos")
        }
    }
});

