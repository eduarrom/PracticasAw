'use strict'

let fs = require('fs');

let fichero = "./text.txt"

let frep = require("./ejmodule.js");

b();

function eliminarEspacios(contenido){
    let expresion = /\s+/g;

    return contenido.replace(expresion, " ")
}

function b(){
    frep.freplaceb(fichero, /h/g , "Edu");
}
