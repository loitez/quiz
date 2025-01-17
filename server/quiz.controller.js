const fs = require('fs/promises');
const chalk = require('chalk');
const path = require('path');
const Quiz = require('./models/Quiz');

async function getQuestions() {
    return Quiz.find()
}

async function getQuestion(id) {
    console.log('get one question')
    return Quiz.find({_id: id})
}

async function removeOption(id, index) {
    try {
        await Quiz.findOneAndUpdate({_id: id}, {$pull:{answers: {_id: index }}})
    } catch (err) {
        console.error(err)
    }
}

async function removeQuestion(id) {
    await Quiz.deleteOne({ _id:id})
}

async function updateQuestion(id, data) {
    try {
        await Quiz.updateOne({_id:id}, data)
        await Quiz.findOneAndUpdate({_id: id}, {answers: data.answers}, {new: true})
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    getQuestions, removeOption, removeQuestion, updateQuestion, getQuestion
}