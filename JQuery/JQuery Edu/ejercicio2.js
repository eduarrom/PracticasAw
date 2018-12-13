let miFormulario = [
    {
        label: "Nombre",
        name: "nombre",
        validator: function(val){
            return (val.length > 0 && (/^[A-Z]{1}[A-Za-z\s]+$/).test(val));
        }
    },
    {
        label: "Apellidos",
        name: "apellidos",
        validator: function(val){
            return (val.length > 0 && (/^[A-Z]{1}[A-Za-z\s]+$/).test(val));
        }
    },
    {
        label: "Edad",
        name: "edad",
        validator: function(val){
            return val != "" && !isNaN(Number(val))
        }
    }
];
    

$(document).ready(function(){
    embedForm($(".form"), miFormulario, function(event, check, validators){
        let form = $(event.target).parent("form");
        validators.forEach(o => {

            let input = form.children("#"+o.object);

            if (!o.validator(input.prop("value"))){

                input.css("border", "2px solid red")
                alert("El elemento " + input.prop("name") + " no es valido");

            } else {

                input.css("border", "2px solid green")

            }
        })
        if (
            form.children("#input0").prop("value") != check.nombre || 
            form.children("#input1").prop("value") != check.apellidos ||
            form.children("#input2").prop("value") != check.edad 
        ){
            form.css("background-color", "red");

            event.preventDefault();
        }
    });
});

function embedForm(selector, formulario, callback){
    selector.append("<form>");
    let form = selector.children("form");
    form.prop("method", "POST").prop("action", "procesarForm")

    let validators = [];

    let contador = 0;
    formulario.forEach(c =>{
        form.append($("<label>"))
        form.children("label").last().prop("for", "input"+contador).text(c.label);
        form.append($("<input>"))
        form.children("input").last().prop("type", "text").prop("name", c.name).prop("id","input"+contador)
        
        validators.push({object: "input"+contador, validator: c.validator})
        contador++;
    })

    form.append($("<input type='submit' value='Enviar'>"));

    form.children("input").last().on("click", function(event){
        callback(event,{nombre:"Juan",apellidos:"Calvo Esteban",edad:"23"}, validators);
    })
}