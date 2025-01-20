import { v4 as uuidv4 } from 'uuid';

export const transformQuestion = (question) => ({
        _id: question._id,
        id: uuidv4(),
        title: question.title,
        answers: question.answers.map((answer) => {
                return {
                        _id: answer._id,
                        id: uuidv4(),
                        text: answer.text,
                        isCorrect: answer.isCorrect,
                }
        })
})