const DaoQuestions = require("../integration/daoQuestions");

function getRandomQuestions(callback){
    const daoQuestions = new DaoQuestions();
    daoQuestions.getRandomQuestions(5,callback);
}

function getQuestion(questionId,callback){
    const daoQuestions = new DaoQuestions();
    daoQuestions.getQuestion(questionId,callback);
}

function getGuessed(questionId,userId,callback){
    const daoQuestions = new DaoQuestions();
    daoQuestions.getGuessed(questionId,userId,(err,result)=>{
        
        let responsed = false;
        let i = 0;

        while(!responsed && i<result.length){
            if(result.id == userId){
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
module.exports = {
    getRandomQuestions:getRandomQuestions,
    getQuestion:getQuestion,
    getGuessed: getGuessed,
    addQuestion: addQuestion
}