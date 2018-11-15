const http = require("http");
const mysql = require("mysql");

const servidor = http.createServer((request,response)=>{
    console.log("metodo"+request.method);
    console.log("URL"+request.url);
    console.log(request.headers);
    response.statusCode = 200;
    response.setHeader = ("Content-type", "text/html");
});
servidor.listen(3000,(err)=>{
    if (err) console.log("Error");
    else console.log("servidor escuchando en el puerto 3000");
});