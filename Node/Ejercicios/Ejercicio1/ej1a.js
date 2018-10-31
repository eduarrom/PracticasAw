'use strict'

let fs = require('fs');

let fichero = "./text.txt"

let frep = require("./ejmodule.js");

b();

function a(){
    fs.readFile(fichero, { encoding : "utf-8" } , function(err, contenido){
        if(err){
            console.log("Error al leer el fichero");
        } else {
            console.log("Fichero leido correctamente");
            fs.writeFile( fichero, eliminarEspacios(contenido), function(err, contenido){
                if(err){
                    console.log("Error al escribir el fichero");
                } else {
                    console.log("Fichero escrito correctamente");
                }
            });
        }      
    });
}

function eliminarEspacios(contenido){
    let expresion = /\s+/g;

    return contenido.replace(expresion, " ")
}

function b(){
    frep.freplace(fichero, /h/g , "Edu", function(err){
        if (err){
            console.log(err.message);
        }
    })
}
