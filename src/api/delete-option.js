export const deleteOption = (questionID, optionID) => {
    return fetch(`/questions/${questionID}/${optionID}`, {
        method: "DELETE",
    })
}