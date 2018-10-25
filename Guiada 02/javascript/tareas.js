let listaTareas = [
{ text: "Preparar práctica AW", tags: ["AW", "practica"] },
{ text: "Mirar fechas congreso", done: true, tags: [] },
{ text: "Ir al supermercado", tags: ["personal"] },
{ text: "Mudanza", done: false, tags: ["personal"] },
];


function getTodoTask(tasks){

  //devuelve array con undefineds
  let listaFiltrada = tasks.map(function(n){ if(!n.done) return n.text});

  //quito los undefineds
  return listaFiltrada.filter(n => n!=undefined);
}


function findByTag(tasks, tag){
	let res = tasks;
	
	return res.filter( 
		f => f.tags.some(
			e => e == tag
		)
	);
		
}

function findByTags(tasks, tags){
	let res = tasks;
	
	return res.filter( 
		f => f.tags.some( 
			e => tags.some( 
				t => e == t 
			) 
		) 
	);
		
}

function countDone(tasks){
	let res = tasks;
	
	return res.filter(
		f => {
			if (f.done != undefined){
				return f.done == true;
			}
		}	
	).length
}

function createTask(texto){
	
	let res = {
		text: "",
		tags: []
	};
	
	let expresionTags = /(@\w*)/g;
	
	let tags = texto.match(expresionTags);
	res.text = texto.replace(expresionTags, "").trim().replace(/\s+/g, " ");
	
	for (let t of tags){
		res.tags.push(t.replace(/@/, ""));
	}
	
	return res;
}