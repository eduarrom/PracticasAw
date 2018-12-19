const express = require("express");
const app = express();
const path = require("path");

var currencyRates = {
    "USD": 1.00000, // Dólar estadounidense
    "EUR": 0.94466, // Euro
    "GBP": 0.82314, // Libra
    "INR": 68.1762, // Rupia india
    "AUD": 1.35989, // Dólar australiano
    "CAD": 1.32303, // Dólar canadiense
    "ZAR": 13.6627, // Rand sudafricano
    "NZD": 1.42890, // Dólar neozelandés
    "JPY": 115.933 // Yen japonés
    };

app.get("/index.html",(request,response)=>{
    response.sendFile(path.join(__dirname,"/index.html"));
})
app.get("/currencies",(request,response)=>{
    response.status(200);
    response.send(Object.keys(currencyRates));
})

app.get("/currency",(request,response)=>{
    if (currencyRates[request.query.from]==undefined || currencyRates[request.query.to]==undefined){
        response.status(400);
        response.send({});
    }else{
        response.status(200);
       response.send({"currency":request.query.from,"result":(Number(request.query.quantity)/currencyRates[request.query.from])*Number(currencyRates[request.query.to])});
    }
})

app.get("/cliente.js",(request,response)=>{
    response.sendFile(path.join(__dirname,"./cliente.js"));
})
app.listen(3000);