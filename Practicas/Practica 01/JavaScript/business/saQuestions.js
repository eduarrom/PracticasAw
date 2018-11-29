const DaoQuestions = require("../integration/daoQuestions");

function getRandomQuestions(callback){
    const daoQuestions = new DaoQuestions();
    daoQuestions.getRandomQuestions(5,callback);
}

module.exports = {
    getRandomQuestions:getRandomQuestions
}