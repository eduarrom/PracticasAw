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

questionsRouter.get("/question/:id",controlAcceso,(request,response)=>{
    saQuestions.getQuestion(request.params.id,(err,question)=>{
        saQuestions.getWhoAnswered(request.params.id,(err,users)=>{
            
            response.render("question.ejs",{question,users});
        })
    });
})

questionsRouter.get("/new_question",controlAcceso,(request,response)=>{
    response.render("new_question.ejs");
})

questionsRouter.post("/addQuestion",controlAcceso,(request,response)=>{
    question = {
        text: request.body.question,
        possibleAnswers: request.body.answers.split(";"),
    }
    saQuestions.addQuestion(question, request.session.currentUser.id, function(cod, err){
        switch (cod){
            case 0:
                response.redirect("/questions/questions")
                break;
            case -1:
                response.render("new_question.ejs");
                break;
        }
    });   
})

module.exports = questionsRouter;