export const getQuestions = () => {
    console.log('GETTING QUESTIONS')
    return fetch('/questions').then((res) => {
        return res.json()
    })
        .catch((err) => {
            console.log(err)})
}