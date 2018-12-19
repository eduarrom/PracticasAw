
function insertMatrix(elementos,matriz,callback){
    
    let nCelda = 0;

    elementos.forEach(fila => {
        
        let filaTabla = $("<tr></tr>");
        matriz.append(filaTabla);

        fila.forEach(elemento =>{    
            
            let celda = $("<td>"+elemento+"</td>");
            filaTabla.append(celda);
            
            celda.nCelda = nCelda;

            celda.on("click",()=>{
                celda.append("<input type='text' value='"+celda.text()+"'></input>");
                callback(celda.nCelda);
            })

            celda.on("blur",()=>{
                celda.children()[0].replaceWith(celda.text());
            })

            nCelda++;
        })
    });
}

$(()=>{
    let m = [
        [ "Esto", "es" , "una fila" ],
        [ "aquí", "va" , "otra fila" ],
        [ "y" , "aquí", "otra más" ]
        ];
    
    insertMatrix(m,$("#tabla"),(celda)=>console.log(celda));
})