export const updateQuestion = (questionData) => {
    console.log(questionData)
    return fetch(`/questions/${questionData._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionData)
    })
}