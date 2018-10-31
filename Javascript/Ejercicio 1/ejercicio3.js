"use strict";

let personas = [
{nombre: "Ricardo", edad: 63},
{nombre: "Paco", edad: 55},
{nombre: "Enrique", edad: 32},
{nombre: "Adrián", edad: 34}
];
//console.log(pluck(personas, "nombre")) // Devuelve: ["Ricardo", "Paco", "Enrique", "Adrián"]
//console.log(pluck(personas, "edad")) // Devuelve: [63, 55, 32, 34]

//console.log(partition(personas, pers => pers.edad >= 60));
//console.log(partition(personas, pers => pers.nombre == "Edu"));

//console.log (groupBy(["Mario", "Elvira", "María", "Estela", "Fernando"], str => str[0]))

console.log(where(personas, { edad: 55 }));
console.log(where(personas, { nombre: "Paco" }));
console.log(where(personas, { nombre: "Edu" }));
console.log(where(personas, { nombre: "Paco", edad: 55 }));
console.log(where(personas, { nombre: "Paco", edad: 45 }));


function pluck(objects, fieldName){
	let res = [];
	for (let i in objects){
		res[res.length] = (objects[i])[`${fieldName}`]
	}
	return res;
}

function partition(array, p){
	let cumple = [];
	let noCumple = [];
	
	for (let i in array){
		if (p((array[i]))){
			cumple[cumple.length] = array[i];
		} else {
			noCumple[noCumple.length] = array[i];
		}
	}
	
	let res = [cumple, noCumple];
	
	return res;
}

function groupBy(array, f){
	let res = {};
	
	for (let i in array){
		
		if (res[`${f(array[i])}`] == undefined){
			res[`${f(array[i])}`] = [array[i]]
		} else {
			res[`${f(array[i])}`].push(array[i])
		}
		
	}
	
	return res;
}

function where(array, modelo){
	let res = [];
	let propiedades;
	
	let comparador = (e, m) => {
		propiedades = Object.keys(m);
		for (let i in propiedades){
			if (e[propiedades[i]] == undefined || e[propiedades[i]] != m[propiedades[i]]){
				return false;
			}
		}
		
		return true;
	}
	for (let i in array){
		
		if (comparador(array[i], modelo)){
			res.push(array[i]);
		}
	}
	
	return res;
}