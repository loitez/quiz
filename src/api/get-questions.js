export const getQuestions = () => {
    return fetch('/questions').then((res) => {
        return res.json()
    })
}