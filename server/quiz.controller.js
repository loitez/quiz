const fs = require('fs/promises');
const chalk = require('chalk');
const path = require('path');
const Quiz = require('./models/Quiz');

async function getQuestions() {
    return Quiz.find()
}

async function removeOption(id, index) {
    //console.log(id, index)
    const answer = Quiz.findById(id)
    console.log(answer)
    const result = Quiz.updateOne({ _id:id},{$pull:{answers: {_id: index }}});
    console.log(result)
    return result
}

async function removeQuestion(id) {
    await Quiz.deleteOne({ _id:id})
}

async function updateQuestion(id, data) {
    console.log(data)
    await Quiz.updateOne({_id:id}, data)
    // await Quiz.findOneAndReplace({_id: id}, data)
}

module.exports = {
    getQuestions, removeOption, removeQuestion, updateQuestion
}