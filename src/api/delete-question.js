export const deleteQuestion = (questionID) => {
    return fetch(`/questions/${questionID}`, {
        method: "DELETE",
    })
}