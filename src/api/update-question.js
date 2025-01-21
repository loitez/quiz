export const updateQuestion = (questionData) => {
    console.log(questionData)
        return fetch(`/questions/${questionData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionData)
        }).then(res => res.json()).catch(err => console.error(err));

}