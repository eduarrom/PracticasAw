$(()=>{
    loadTasks();
    $(".contenedorTareas").on("click",".botonTerminarTarea",function(event){
        onRemoveButtonClick(event);
        $(".contenedorTareas").empty();
    })

    $("#anadir").on("click",function(event){
        onAddButtonClick(event);
        $(".contenedorTareas").empty();
    })
})

function tasktoDOMElement(task){

    let tarea = $("<div></div>");
    tarea.prop("class", "tarea");
    
    tarea.data("id",task.id);

    let contenedor = $("<div></div>").prop("class", "contenedorDatos");
    contenedor.append($("<span></span>").prop("class","nombreTarea").text(task.text));
    
    tarea.append(contenedor);
    tarea.append($('<input type="button" class="botonTerminarTarea" value="Marcar como Terminada"></input>'));
    
    $(".contenedorTareas").append(tarea);
}

function loadTasks(){
    $.ajax({
        contentType:"application/json",
        url:"/tasks",
        type:"GET",
        success:function(data){
            data.forEach((element)=>{tasktoDOMElement(element)});
    }})
}

function onRemoveButtonClick(event){
    $.ajax({
        url:"/tasks/" + $(event.target).parent().data("id"),
        type:"DELETE",
        contentType:"application/json",
        sucess:loadTasks()
    })
}

function onAddButtonClick(event){
    $.ajax({
        data:JSON.stringify({text:$(".inputTarea").val()}),
        url:"/tasks/",
        type:"POST",
        contentType:"application/json",
        sucess:loadTasks(),

    })
}