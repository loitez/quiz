const path = require("path");
const express = require("express");
const chalk = require('chalk');
const mongoose = require("mongoose");
const Quiz = require('./models/Quiz');
const dotenv = require('dotenv');
const {getQuestions, removeOption, removeQuestion, updateQuestion, getQuestion} = require("./quiz.controller");

dotenv.config();

const PORT = process.env.PORT || 3001;
const adminPassword = encodeURIComponent( process.env.ADMIN_PASSWORD )

const app = express()
app.use(express.json())

app.get('/questions', async (req, res) => {
    const questions = await getQuestions() || []
    res.status(200).json({ questions })
})

app.get('/questions/:id', async (req, res) => {
    console.log(req.params.id)
    const question = await getQuestion(req.params.id)
    res.status(200).json(question[0])
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
    try {
        await updateQuestion(req.body._id, req.body);
        res.sendStatus(200)
    } catch (err) {
        res.status(400).json({error: err})
        console.log(err)
    }
})

mongoose.connect(`mongodb+srv://loitez:${adminPassword}@quiz.kyqzp.mongodb.net/quiz?retryWrites=true&w=majority&appName=Quiz`)
    .then(() => {
    app.listen(PORT, () => console.log(chalk.green("Server started on port: " + PORT)));
})
