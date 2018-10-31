function sequence1(funciones,x){

  let resultado = x;

  for(let i = 0; i<funciones.length; i++)
    resultado = funciones[i](resultado);

  return resultado;
}



function sequence2(funciones,x){

  let resultado = x;

  for(let i = 0; i<funciones.length; i++)
  {
    if(funciones[i] == undefined)
      return undefined;
    else
      resultado = funciones[i](resultado);
  }

  return resultado;
}





function sequence3(funciones,x,right=false){

  let resultado = x;

  if(right)
    for(let i = funciones.length-1; i >= 0; i--)
        resultado = funciones[i](resultado);
  else
    for(let i = 0; i<funciones.length; i++)
        resultado = funciones[i](resultado);

  return resultado;
}
