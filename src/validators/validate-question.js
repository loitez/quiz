export const validateQuestion = (question) => {
    if (question.title.trim() === '') {
        return {error: 'Заголовок вопроса должен быть заполнен'}
    }
    return {error: null}
}