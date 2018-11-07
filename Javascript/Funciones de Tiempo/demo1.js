let intervalo,segundos = 0;

function aumentar(max){
  //(Crear en el html un <h1> con id = "texto")
  document.getElementById("texto").innerHTML=segundos;
  segundos++;
   if(segundos > max){
       clearInterval(intervalo);
	   setTimeout(borrar, 10000)
		window.alert("FINAL");	
   }
}

function iniciar(){
	intervalo = setInterval(aumentar,1000,document.getElementById('max').value);
}
function parar(){
    clearInterval(intervalo);
}
function borrar(){
	segundos = 0; 
	document.getElementById("texto").innerHTML=segundos; 
	clearTimeout(this)
}
function reiniciar(){
	parar();
	segundos=0;
	iniciar();
}
