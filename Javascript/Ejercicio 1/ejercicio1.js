"use strict";

console.log("1: " + producto(8, 2));
console.log("2: " + producto(8, [2, 3]));
console.log("3: " + producto([2, 3], [3, 4]));
console.log("4" + producto([2, 3], [3, 4, 5]));

function producto(x, y){
	let res = 0;
	if (typeof(x) == "number" && typeof(y) == "number"){
		res = x * y;
	} else if (typeof(x) == "number" && y instanceof Array){
		res = [];
		for (let i = 0; i < y.length; i++){
			res[res.length] = y[i] * x;
		}
	} else if (x instanceof Array && y instanceof Array && x.length == y.length){
		let mul = [];
		for (let i = 0; i < x.length; i++){
			res += x[i] * y[i];
		}
	} else {
		throw new Error("No disponible");
	}
	
	return res;
}