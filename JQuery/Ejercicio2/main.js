function embedForm(selector,formulario,callback){
    let form = $("<form method=”POST” action=”procesarForm”></form>");
    selector.append(form);
    
    for(let i = 0; i<formulario.length;i++){
        form.append("<label for='#input"+i+"'>"+formulario[i].label+"</label><input type='text' name='"+formulario[i].name+"' id='#input"+i+"'>");
    };
    let submit = $("<input type='submit' value='Enviar'></input>");
    submit.on("click",function(){
        
        let ret={};
        let lista = form.children();
        
        for(let i = 0; i < lista.length-1; i = i+2){
        
            ret[lista[i].innerText]=lista[i+1].value;
        
            if(!formulario[i/2].validator(lista[i+1].value))
                alert("Error en el campo "+ lista[i].innerText);
        }
        callback(ret);
    });
    
    form.append(submit);
}

$(function(){
    let miFormulario = [
        {
        label: "Edad",
        property: "edad",
        validator: function(val) {
        // Devuelve true si el valor pasado
        // como parámetro es un número
        return !isNaN(Number(val));
        }
        },
        {
            label: "Edad2",
            property: "edad2",
            validator: function(val) {
            // Devuelve true si el valor pasado
            // como parámetro es un número
            return !isNaN(Number(val));
            }
            },
            {
                label: "Edad3",
                property: "edad3",
                validator: function(val) {
                // Devuelve true si el valor pasado
                // como parámetro es un número
                return !isNaN(Number(val));
                }
                }
        ];
        

    embedForm($("body"),miFormulario,(resultado)=>console.log(resultado));
})