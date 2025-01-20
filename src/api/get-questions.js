import {transformQuestion} from "../transformers/transform-question";

/*
export const getQuestions = () => {
    console.log('GETTING QUESTIONS')
    return fetch('/questions').then((res) => res.json()).then(({questions}) => {
        console.log(questions)
        questions.map((item) => transformQuestion(item))
        console.log(questions)
    })
        .catch((err) => {
            console.log(err)})
}*/

export const getQuestions = () => {
    return fetch('/questions').then((loadedQuestions) =>
        loadedQuestions
            .json()
            .then(({questions}) => questions && questions.map((question) => transformQuestion(question)))
    )
}