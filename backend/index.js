const path = require("path");
const express = require("express");
const chalk = require('chalk');
const mongoose = require("mongoose");
const Quiz = require('./models/Quiz');
const dotenv = require('dotenv');
const {getQuestions} = require("./quiz.controller");

dotenv.config();

const PORT = process.env.PORT || 3001;
const adminPassword = encodeURIComponent( process.env.ADMIN_PASSWORD )

const app = express()

app.get('/questions', async (req, res) => {
    const questions = await getQuestions()
    console.log(questions)
    res.status(200).json({ questions })
})

mongoose.connect(`mongodb+srv://loitez:${adminPassword}@quiz.kyqzp.mongodb.net/quiz?retryWrites=true&w=majority&appName=Quiz`)
    .then(() => {
    app.listen(PORT, () => console.log(chalk.green("Server started on port: " + PORT)));
})
