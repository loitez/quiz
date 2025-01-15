const fs = require('fs/promises');
const chalk = require('chalk');
const path = require('path');
const Quiz = require('./models/Quiz');

async function getQuestions() {
    return Quiz.find();
}

module.exports = {
    getQuestions
}