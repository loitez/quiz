export const getQuestionOptions = (id) => {
    return fetch(`/questions/${id}`, {
        method: 'GET',
    }).then(res => res.json()).then((data) => {
        console.log(data.answers)
        return data.answers
    })
}

/*
export const getQuestionOptions = (id) => {
    console.log('GETTING QUESTION')
    return fetch(`/questions/${id}`).then((res) => {
        return res.json()
    })
        .catch((err) => {
            console.log(err)})
}*/
