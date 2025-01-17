const path = require("path");
const express = require("express");
const chalk = require('chalk');
const mongoose = require("mongoose");
const Quiz = require('./models/Quiz');
const dotenv = require('dotenv');
const {getQuestions, removeOption, removeQuestion, updateQuestion} = require("./quiz.controller");

dotenv.config();

const PORT = process.env.PORT || 3001;
const adminPassword = encodeURIComponent( process.env.ADMIN_PASSWORD )

const app = express()
app.use(express.json())

app.get('/questions', async (req, res) => {
    const questions = await getQuestions() || []
    res.status(200).json({ questions })
})

app.delete('/questions/:id/:index', async (req, res) => {
    await removeOption(req.params.id, req.params.index)
    res.sendStatus(200)

})

app.delete('/questions/:id', async (req, res) => {
    await removeQuestion(req.params.id)
    res.sendStatus(200)
})

app.put('/questions/:id', async (req, res) => {
    await updateQuestion(req.params.id, req.body)
    res.sendStatus(200)
})

mongoose.connect(`mongodb+srv://loitez:${adminPassword}@quiz.kyqzp.mongodb.net/quiz?retryWrites=true&w=majority&appName=Quiz`)
    .then(() => {
    app.listen(PORT, () => console.log(chalk.green("Server started on port: " + PORT)));
})
