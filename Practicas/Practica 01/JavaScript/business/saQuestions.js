const DaoQuestions = require("../integration/daoQuestions");

function getRandomQuestions(callback){
    const daoQuestions = new DaoQuestions();
    daoQuestions.getRandomQuestions(5,callback);
}

function getQuestion(questionId,callback){
    const daoQuestions = new DaoQuestions();
    daoQuestions.getQuestions(questionId,callback);
}

function getWhoAnswered(questionId,callback){
    const daoQuestions = new DaoQuestions();
    daoQuestions.getAnswers(questionId,(err,result)=>{
        let users = [];
        result.forEach(user => {
            if(user.supplanted==user.respondent)
                users.push({name:name,id:id});
        });
        callback(err,users);
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
    getWhoAnswered:getWhoAnswered,
    addQuestion: addQuestion
}