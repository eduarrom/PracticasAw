let listaTareas = [
{ text: "Preparar práctica AW", tags: ["AW", "practica"] },
{ text: "Mirar fechas congreso", done: true, tags: [] },
{ text: "Ir al supermercado", tags: ["personal"] },
{ text: "Mudanza", done: false, tags: ["personal"] },
];

console.log(getToDoTasks(listaTareas));

function getToDoTasks(tasks){
	
	//devuelve en primer lugar el texto de la tarea si done no es true o undefined si lo es y despues
	//filtra devolviendo unicamente aquellos en los que lo almacenado no es undefined
	return tasks.map( n => n.done != true ? n.text : undefined ).filter( n => n != undefined )
	
	/*
	  //devuelve array con undefineds
	  let listaFiltrada = tasks.map(function(n){ if(!n.done) return n.text});
	  

	  //quito los undefineds
	  return listaFiltrada.filter(n => n !=undefined);
	  */
}


function findByTag(tasks, tag){
	
	//filtra manteniendo aquellas tareas f que contienen el tag indicado
	return tasks.filter( 
		f => f.tags.some(
			e => e == tag
		)
	);
		
}

function findByTags(tasks, tags){
	
	//filtra manteniendo aquellas tareas f que contienen alguno de los tags indicados
	return tasks.filter( 
		f => f.tags.some( 
			e => tags.some( 
				t => e == t 
			) 
		) 
	);
		
}

function countDone(tasks){
	
	//devuelve un valor acumulado que se ha aumentado en 1 cuando done es true en el objeto
	return tasks.reduce( (ac,f) => f.done == true ? ac += 1 : ac , 0 )
}

function createTask(texto){
	
	let res = {
		text: "",
		tags: []
	};
	
	//expresion en la que de forma global se selecionan las subcadenas 
	//empiecen por @ y contengan despues caracteres alfanumericos
	let expresionTags = /@(\w*)/g;
	
	//devuelve los tags con la @
	let tags = texto.match(expresionTags);
	
	//almacenamos en el objeto res el texto de la tarea quitando los tags, eliminando los espacios
	//sobrantes en los extremos y sustituyendo las partes donde haya mas de un espacio junto por
	//un solo espacio
	res.text = texto.replace(expresionTags, "").trim().replace(/\s+/g, " ");
	
	//para cada uno de los tags obtenidos los almacenamos en el array tags de res quitando las @
	tags.map( t => res.tags.push(t.replace(/@/, "")));
	
	//devuelve el objeto de la tarea nueva con sus tags
	return res;
}