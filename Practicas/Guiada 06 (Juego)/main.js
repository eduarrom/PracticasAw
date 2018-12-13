$(function(){
    let cartas;
    let primera;
    let clicks = 0;
    let bloqueado = false;

    $("#iniciar").on("click",function(){
        $("#board").empty();
        $("#clicks").text(clicks + " clicks")

        nCartas= Number($("#modo input:checked").val());
        cartas=obtenerAleatorios(nCartas);
        let carta;

        for(let i = 0; i<nCartas;i++){
            carta= $('<img class="carta" src="recursos/card.png" alt="carta">');       
            carta.css("margin", "10px");     
            $("#board").append(carta);
            carta.on("click",function(){ 
                if (!bloqueado){
                    clicks++; 
                    $("#clicks").text(clicks + " clicks")
                    if (primera == undefined){
                        primera = $(this)
                        voltearCarta(cartas, primera);
                    } else if (primera.index() != $(this).index()) {
                        segunda = $(this);
                        voltearCarta(cartas, segunda);
                        bloqueado = true;
                        setTimeout(function(){
                            if (cartas[segunda.index()] == cartas[primera.index()]){
                                deshabilitarAcertadas(primera, segunda);
                            } else {
                                voltearError(primera,segunda);
                            }
                            primera = undefined;
                            segunda = undefined;                            
                            bloqueado = false;
                        }, 2000);
                    };
                }
            })
        }
    })
})
//calculo las posiciones del par aleatoriamente
function obtenerAleatorios(tam){
    let aleatorios =[];

    for (let i = 0; i < tam/2;i++){
        aleatorios.push(i);
        aleatorios.push(i);
    }

    aleatorios.sort(function(a, b){return 0.5 - Math.random()})


    return aleatorios;
}

function deshabilitarAcertadas(primera, segunda){
    primera.animate({
        opacity: 0.2
    })
    primera.off("click")
    segunda.animate({
        opacity: 0.2
    })
    segunda.off("click");
}

function voltearCarta(cartas, carta){
    carta.animate({opacity: 0},function(){
        carta.prop("src", "recursos/iconos/"+ cartas[carta.index()] +".png").animate({opacity: 1})
    })
}
function voltearError(primera, segunda){
    primera.animate({opacity: 0},function(){
        primera.prop("src", "recursos/card.png").animate({opacity: 1})
        //primera = undefined;
    })
    segunda.animate({opacity: 0},function(){
        segunda.prop("src", "recursos/card.png").animate({opacity: 1})
        //segunda = undefined;
    })
}