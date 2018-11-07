function concatenar(separador){
	let res = "";
	for(let i=1; i<arguments.length; i++){
		res = res + arguments[i] + separador;
	}
	return res;
}