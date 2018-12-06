const DaoQuestions = require("../integration/daoQuestions");
const DaoUsers = require("../integration/daoUsers");

const CORRECTPOINTS = 50;

function getRandomQuestions(callback){
    const daoQuestions = new DaoQuestions();
    daoQuestions.getRandomQuestions(5,callback);
}

function getQuestion(questionId,userId,callback){
    const daoQuestions = new DaoQuestions();
    daoQuestions.getQuestion(questionId,userId,function(err, result){
        if (err){
            callback(err, null);
        } else {
            if (userId != -1){
                daoQuestions.getAnswer(questionId, userId, function(err, answer){
                    if (err){
                        callback(err, null);
                    } else {
                        if (answer != undefined){
                            let correctAnswer = result.possibleAnswers.filter(val => val.number == answer.choosen);
                            let restAnswers = result.possibleAnswers.filter(val => val.number != answer.choosen).sort(function(a, b){return 0.5 - Math.random()}).slice(0, 3);
                            let defAnswers = restAnswers.concat(correctAnswer).sort(function(a, b){return 0.5 - Math.random()});
                            callback(null,{question: result.question, possibleAnswers:defAnswers});
                        } else {
                            callback(null, result);
                        }
                    }
                })
            } else {
                callback(null, result);
            }
        }
    })
}

function getGuessed(questionId,userId,callback){
    const daoQuestions = new DaoQuestions();
    daoQuestions.getGuessed(questionId,userId,(err,result)=>{
        
        let responsed = false;
        let i = 0;

        while(!responsed && i<result.length){
            if(result[i].id == userId){
                 responsed = true;
                 result.splice(i,1);
            }
            i++;
        }
        
        callback(err,result,responsed);
    })
}

function addQuestion(question,userId,callback){
    const daoQuestions = new DaoQuestions();
    daoQuestions.addQuestion(question,userId,function(err){
        if (err){
            callback(-1, err.message);
        } else {
            callback(0, null);
        }
    })
}

function answerQuestion(questionId, answer, userId, supplanted,newAnswerText,callback){
    const daoQuestions = new DaoQuestions();
    if(newAnswerText!=null)
        daoQuestions.addAnswer(answer,questionId,newAnswerText,userId,(err)=>{
            if(err)callback(err,0);
            
            daoQuestions.answerQuestion(questionId, answer, userId, supplanted,(err)=>{
                callback(err,0);
            });
        })
    else{
        daoQuestions.answerQuestion(questionId, answer, userId, supplanted,(err)=>{

            if(err){callback(err,0)}
            //actualizo los puntos
            else if(userId != supplanted)
                daoQuestions.getAnswer(questionId,supplanted,(err,result)=>{
                    if(err){
                        callback(err,0);
                    }
                    daoQuestions.addNotification(userId,questionId,supplanted,function(err){
                        if(err){
                            callback(err,0)
                        } else {
                            if(result.choosen == answer){
                                const daoUsers = new DaoUsers();
                                daoUsers.addPoints(userId,CORRECTPOINTS,(err)=>{
                                    if(err) callback(err,0);
                                    else callback(null,CORRECTPOINTS);
                                });
                            }else callback(null,0);
                        }                       
                    })     
            });
            else callback(null,0);
        });
    }
}
module.exports = {
    getRandomQuestions:getRandomQuestions,
    getQuestion:getQuestion,
    getGuessed: getGuessed,
    addQuestion: addQuestion,
    answerQuestion: answerQuestion
}