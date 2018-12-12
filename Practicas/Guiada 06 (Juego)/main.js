$(function(){
    let cartas;

    $("#iniciar").on("click",function(){
        nCartas= Number($("#modo input:checked").val());
        cartas=obtenerAleatorios(nCartas);
        let carta;

        for(let i = 0; i<nCartas;i++){
            carta= $('<img class="carta" src="recursos/card.svg" alt="carta">');            
            $("#board").append(carta);
            carta.on("click",function(){
                console.log(cartas[$(this).index()]);
            })
        }
    })
})
//calculo las posiciones del par aleatoriamente
function obtenerAleatorios(tam){
    let aleatorios =[];
    let descartados = [];
    let aleatorio=-1;

    for(let i = 0; i<tam/2;i++){
        while(descartados.indexOf(aleatorio)!=-1)   //compruebo que no haya salido ya
            aleatorio=Math.floor((Math.random() * tam) + 0);

        descartados.push(aleatorio); //posicion de la primera carta
        aleatorios[aleatorio]=i;

        while(descartados.indexOf(aleatorio)!=-1)   //compruebo que no haya salido ya
        aleatorio=Math.floor((Math.random() * tam) + 0);

         descartados.push(aleatorio); //posicion de la segunda carta
         aleatorios[aleatorio]=i;
    }

    return aleatorios;
}