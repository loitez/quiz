const mongoose = require('mongoose');
const {Types} = require("mongoose");

const QuizSchema = mongoose.Schema({
    _id: {type: Types.ObjectId, default: () => new Types.ObjectId, required: true},
    title: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    answers: [{text: {type: String, required: true}, isCorrect: {type: Boolean, required: true}, id: {type: String, required: true}}]
})

const Quiz = mongoose.model("Quiz", QuizSchema);



module.exports = Quiz;