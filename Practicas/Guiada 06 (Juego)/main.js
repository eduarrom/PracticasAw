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
                        primera.prop("src", "recursos/iconos/"+ cartas[primera.index()] +".png");
                    } else {
                        segunda = $(this);
                        segunda.prop("src", "recursos/iconos/"+ cartas[segunda.index()] +".png");
                        bloqueado = true;
                        setTimeout(function(){
                            if (cartas[segunda.index()] == cartas[primera.index()] && segunda.index() != primera.index()){
                                primera.css("visibility", "hidden");
                                segunda.css("visibility", "hidden");
                            } else {
                                primera.prop("src", "recursos/card.png"); 
                                segunda.prop("src", "recursos/card.png");
                            }

                            primera = undefined;
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