const mongoose = require('mongoose');

const QuizSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    }
})

const Quiz = mongoose.model("Quiz", QuizSchema);

module.exports = Quiz;