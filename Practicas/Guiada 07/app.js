const express =require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
let tasks = [ 
    {
  id: 1,
  text: "Comprar billetes de avión"
    },
    {
 id: 2,
 text: "Hacer las maletas"
    },
    {
 id: 3,
 text: "Comprar regalos de reyes"
    },
    {
 id: 4,
 text: "Reservar coche"
    }
    ];

let idCounter = tasks.length;

app.use(express.static(path.join(__dirname,"/public")));
app.use(bodyParser.json());

app.get("/",function(request,response){
    response.redirect("/index.html");
})

app.get("/tasks",function(request,response){
    response.json(tasks);
    response.end();
})

app.post("/tasks",function(request,response){

    let id = idCounter + 1;
    let text = request.body.text;

    tasks.push({id:id,text:text});

    idCounter++;
    
    response.json({id:id,text:text});
    response.end();
})

app.delete("/tasks/:id",function(request,response){
    if(isNaN(Number(request.params.id))){
        response.status(400);
        response.end();
    }else{
        let index = tasks.findIndex((task)=>{return task.id==Number(request.params.id)});

        if(index == -1){
            response.status(404);
            response.end();
        }else{
            tasks.splice(index,1);
            response.status(200);
            response.end();
        }
    }
})
app.listen(3000,()=>{
    console.log("escuchando en 3000");
})
