//Definicion de modulos externos
const express = require('express');
const { body, validationResult } = require('express-validator/check');

//importamos nuestros modulos
const saQuestions = require("./business/saQuestions");
const middlewares = require("./middlewares");
const controlAcceso = middlewares.controlAcceso;

//Expresiones regulares para parseo de campos:
	
    const expresionQuestion = /^[¿a-zA-Z0-9]{1}[\w\s]+[?]{1}$/
    const expresionPossibleAnswersSeparator = /[;]{1}[a-zA-Z0-9]{1}/
    const expresionPossibleAnswers = /^[a-zA-Z0-9]{1}[\w\s;]+/

const questionsRouter = express.Router();

questionsRouter.get("/questions",controlAcceso,(request,response)=>{
    saQuestions.getRandomQuestions((err,list)=>{
        response.render("questions.ejs",{preguntas:list})
    })
})

questionsRouter.get("/question/:id",controlAcceso,(request,response)=>{
    saQuestions.getQuestion(request.params.id,-1,(err,question)=>{
        saQuestions.getGuessed(request.params.id,request.session.currentUser.id, (err,users,responsed)=>{
            
            response.render("question.ejs",{question:question, users:users,responsed:responsed});
        })
    });
})

questionsRouter.get("/new_question",controlAcceso,(request,response)=>{
    response.render("new_question.ejs", {errors: null});
})

questionsRouter.post("/addQuestion",controlAcceso, [
    body('question')
    .not().isEmpty().withMessage("La pregunta no puede dejarse en blanco")
    .custom(value => expresionQuestion.test(value)).withMessage("La pregunta no tiene un formato correcto"),
    body('answers')
    .not().isEmpty().withMessage("Las respuestas no pueden dejarse en blanco")   
    .custom(value => expresionPossibleAnswers.test(value)).withMessage("Las respuestas no tienen un formato correcto")
    .custom(value => expresionPossibleAnswersSeparator.test(value)).withMessage("El separador (;) tiene que ir seguido de un caracter"),
], (request,response)=>{

    var errors = validationResult(request).array();
	if (errors.length > 0) {
		let params = [];
		errores = errors.filter(function(elem){
			if (params.indexOf(elem.param) == -1){
				params.push(elem.param);
				return true;
			} else {
				return false;
			}
		})
		return response.status(422).render("new_question.ejs", { errors: errores });
    }
    
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
                response.render("new_question.ejs",{errors: [{msg: err}] });
                break;
        }
    });   
})

questionsRouter.get("/answer/:questionId/:userId",controlAcceso,(request,response)=>{
    saQuestions.getQuestion(request.params.questionId,request.params.userId,(err,question)=>{
        response.render("answerFriend.ejs",{question:question,friend:request.params.userId});
    })
})


questionsRouter.post("/doAnswer",controlAcceso,(request,response)=>{
    saQuestions.answerQuestion(
        request.body.questionId,
        request.body.answer == -1 ? request.body.number:request.body.answer,
        request.session.currentUser.id,
        request.body.friendId,
        request.body.answer == -1 ? request.body.answerText : null,
        (err,points)=>{
            request.session.currentUser.points+=points;
            response.redirect("/questions/question/"+request.body.questionId);
        }
    );
})

module.exports = questionsRouter;