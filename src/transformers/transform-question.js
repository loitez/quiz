import { v4 as uuidv4 } from 'uuid';

export const transformQuestion = (question) => ({
        _id: question._id,
        id: uuidv4(),
        title: question.title,
        answers: question.answers
})