let m = [
    [ "Esto", "es" , "una fila" ],
    [ "aquí", "va" , "otra fila" ],
    [ "y" , "aquí", "otra" ],
    [ "y" , "aquí", "otra más" ]
    ];

$(document).ready(function(){
    insertMatrix($("div").first(), m, function(celda){
        alert(celda.text())
    })
});

function insertMatrix(selector, matriz, callback){

    selector.append($("<table>"))

    let tabla = selector.children("table")
    tabla.css("border", "solid 1px black");

    matriz.forEach(f => {

        tabla.append($("<tr>"))
        let celda = tabla.children("tr").eq(tabla.children("tr").length - 1);

        f.forEach(c => {
            celda.append($("<td>" + c + "</td>"))
        })

        celda.children("td").css("border", "solid 1px black")

    })

    tabla.on("click", "td", function(event){
        callback($(event.target));
    });
}