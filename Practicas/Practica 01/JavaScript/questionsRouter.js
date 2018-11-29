//Definicion de modulos externos
const express = require('express');

//importamos nuestros modulos
const saQuestions = require("./business/saQuestions");
const middlewares = require("./middlewares");
const controlAcceso = middlewares.controlAcceso;

const questionsRouter = express.Router();

questionsRouter.get("/questions",controlAcceso,(request,response)=>{
    saQuestions.getRandomQuestions((err,list)=>{
        response.render("questions.ejs",{preguntas:list})
    })
})

module.exports = questionsRouter;