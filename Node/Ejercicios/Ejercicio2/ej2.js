var dao = require("./dao.js")

let usuario = {
    nombre: "Mensajero1",
    correo: "mensajero1@ucm.es",
    telefono: 677777777
}

let usuario2 = {
    nombre: "Mensajero2",
    correo: "mensajero2@ucm.es",
    telefono: 666666666
}

let mensaje = {
    idOrigen: 8,
    idDestino: 9,
    mensaje: "Esto es un mensaje"
}

let mensaje2 = {
    idOrigen: 8,
    idDestino: 9,
    mensaje: "Esto es otro mensaje"
}
/*
dao.insertarUsuario(usuario, function(err){
    if (err != null){
        console.log(err.message);
    } else {
        console.log("Usuario insertado correctamente");
    }
})

dao.insertarUsuario(usuario2, function(err){
    if (err != null){
        console.log(err.message);
    } else {
        console.log("Usuario insertado correctamente");
    }
})

dao.enviarMensaje(mensaje.idOrigen, mensaje.idDestino, mensaje.mensaje, function(err){
    if (err != null){
        console.log(err.message);
    } else {
        console.log("Mensaje enviado correctamente");
    }
})

dao.enviarMensaje(mensaje2.idOrigen, mensaje2.idDestino, mensaje2.mensaje, function(err){
    if (err != null){
        console.log(err.message);
    } else {
        console.log("Mensaje enviado correctamente");
    }
})
*/

dao.bandejaEntrada(usuario2, function(err, mensajes){
    if (err != null){
        console.log(err.message);
    } else {
        if(mensajes.length > 0){
            mensajes.forEach(e => {
                console.log(e.mensaje)
            });
        } else {
            console.log("No hay mensajes")
        }
    }
});

dao.buscarUsuarios("mensas", function(err, usuarios){
    if (err != null){
        console.log(err.message);
    } else {
        if (usuarios.length > 0){
            usuarios.forEach(e => {
                console.log(e.nombre)
            });
        } else {
            console.log("No existen usuarios")
        }
    }
});

