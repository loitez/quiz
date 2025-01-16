import {useEffect, useMemo, useState} from "react";
import {getQuestions} from "../../api";
import {TestQuestion} from "../../components";
import {Link, useNavigate} from "react-router-dom";
import {Button, ButtonGroup, Spinner} from "react-bootstrap";
import styled from "styled-components";
import {debounce} from "../../utils";

const TestContainer = styled.div`
    min-width: 600px;
`

export const Test = () => {

    const [questions, setQuestions] = useState([]); // все вопросы
    const [currentQuestion, setCurrentQuestion] = useState(''); // для переключения вопросов
    const [currentIndex, setCurrentIndex] = useState(0); // индекс нынешнего вопроса

    const [isEnded, setIsEnded] = useState(false); // для показа результатов
    const [hash, setHash] = useState('') // дата и время начала теста

    const [userAnswers, setUserAnswers] = useState([]); // массив ответов юзера, заполняется постепенно


    // const [answersHistory, setAnswersHistory] = useState([]) localHistory вместо, пока работает
    const [correctAnswersCount, setCorrectAnswersCount] = useState(null) // TODO: мб убрать?
    const [questionsCount, setQuestionsCount] = useState(null)
    const [userAnswer, setUserAnswer] = useState(null)

    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true) // для лоадера

    const [isDisabled, setIsDisabled] = useState(false) // дизейбл вопросов
    const [isChecked, setIsChecked] = useState(isDisabled === true) // для дизейбла кнопки след вопрос

    const debouncedCheck = useMemo(() => debounce(setIsChecked, 100), [])
    const debouncedSetQuestion = useMemo(() => debounce(setCurrentQuestion, 700), [])
    const debouncedSetDisabled = useMemo(() => debounce(setIsDisabled, 700),[])

    let localHistory = JSON.parse(localStorage.getItem('testHistory'))


    useEffect(() => {
        getQuestions().then(({questions}) => {
            setQuestions(questions);
            setCurrentQuestion(questions[currentIndex])
            setQuestionsCount(questions.length)
            setIsLoading(false)
        })


        const date = new Date();
        setHash(date.toLocaleString("ru-RU"))
    }, [isEnded]);

    const onNextClick = () => {
        if (currentIndex === questions.length - 1) {
            setIsEnded(true)
            countCorrectAnswers()
            setHash('')
            setUserAnswers([])
        }

        setCurrentIndex(currentIndex + 1);
        debouncedSetQuestion(questions[currentIndex + 1])
        //setCurrentQuestion(questions[currentIndex + 1])
        //setIsChecked(false)
        setIsChecked(false)
        debouncedSetDisabled(false)
    }

    const onPrevClick = () => {
        setCurrentIndex(currentIndex - 1);
        //setCurrentQuestion(questions[currentIndex - 1])
        debouncedSetQuestion(questions[currentIndex - 1])
        setIsChecked(true)
        debouncedSetDisabled(true)
        //setUserAnswer[userAnswers[currentIndex - 1]]
        const userAnswer = findUserAnswer(currentIndex - 1)
    }

    const findUserAnswer = (questionIndex) => {
        return userAnswers[questionIndex]
    }

    const onAnswerChange = (isCorrect, questionID, answerValue) => {
        const answer = userAnswers.find((answer) => answer.id === questionID)

        if (answer) {
            const index = userAnswers.indexOf(answer)
            userAnswers[index].isCorrect = isCorrect
        } else {
            userAnswers.push({id: questionID, isCorrect: isCorrect, value: answerValue})
        }
        setUserAnswers(userAnswers)

        if (localHistory?.length > 0) {
            const session = localHistory.find((history) => history.session === hash)
            if (session) {
                const index = localHistory.indexOf(session)
                localHistory[index].answers = userAnswers
            } else {
                localHistory.push({session: hash, answers: userAnswers, questionsCount: questionsCount})
            }

            //setAnswersHistory(answersHistory)
        } else {
            localHistory = {session: hash, answers: userAnswers, questionsCount: questionsCount}
            //setAnswersHistory(answersHistory)
        }

        localStorage.setItem('testHistory', JSON.stringify(localHistory))

        setIsDisabled(true)
        debouncedCheck(true)
    }

    const startAgain = () => {
        setCurrentIndex(0);
        setCurrentQuestion(questions[0])
        setIsEnded(false)
    }

    const countCorrectAnswers = () => {
        const correctAnswers = localHistory.answers.filter((item) => item.isCorrect === true).length
        setCorrectAnswersCount(correctAnswers)
    }

    return (
        <>
            { isLoading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <TestContainer className="d-flex flex-column mw-100">
                    { isEnded ? (
                        <>
                            <div className="mb-5">
                                <div className="fs-2 fw-semibold">Правильных ответов:</div>
                                <div>{correctAnswersCount}/{questionsCount}</div>
                            </div>
                            <div aria-label="Basic example" className="d-grid mb-3 gap-0 column-gap-3 d-md-flex">
                                <Button variant="outline-dark" className="me-2 w-100" onClick={() => navigate('/')}>
                                    На главную
                                </Button>
                                <Button variant="outline-dark" className="me-2 w-100" onClick={startAgain}>Пройти еще раз</Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-5">
                                <div className="text-center mb-2">{currentIndex + 1}/{questions.length}</div>
                                <TestQuestion key={currentQuestion.id} index={currentQuestion._id} title={currentQuestion.title}
                                              answers={currentQuestion.answers} onChange={onAnswerChange} isDisabled={isDisabled} userAnswer={userAnswers[currentIndex - 1]}/>
                            </div>
                            <div aria-label="Basic example" className="d-grid mb-3 gap-0 column-gap-3 d-md-flex">
                                <Button variant="outline-dark" className="me-2 w-100" onClick={onPrevClick}
                                        disabled={currentIndex === 0}>Предыдущий вопрос</Button>
                                <Button variant="outline-dark" className="me-2 w-100" onClick={onNextClick} disabled={!isChecked}>{
                                    currentIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'
                                }</Button>
                            </div>
                        </>
                    )}
                    </TestContainer>
            )}


        </>


    )
}