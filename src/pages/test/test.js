import {useEffect, useMemo, useState} from "react";
import {getQuestions} from "../../api";
import {NoQuestionsFound, TestQuestion} from "../../components";
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


    const [answersHistory, setAnswersHistory] = useState([])
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
    const debouncedSetCurrentIndex = useMemo(() => debounce(setCurrentIndex, 700), [])
    const debouncedSetIsEnded = useMemo(() => debounce(setIsEnded, 700),[])

    let localHistory = JSON.parse(localStorage.getItem('testHistory'))


    useEffect(() => {
        getQuestions().then((questions) => {
            console.log(questions)
            setQuestions(questions);
            setCurrentQuestion(questions[currentIndex])
            setQuestionsCount(questions.length)
            setIsLoading(false)
        })



        if (localHistory) {
            setAnswersHistory(localHistory)
        }



        const date = new Date();
        setHash(date.toLocaleString("ru-RU"))
    }, [isEnded]);

    const onNextClick = () => {
        if (currentIndex === questions.length - 1) {
            //setIsEnded(true)
            debouncedSetIsEnded(true)
            countCorrectAnswers()
            setHash('')
            setUserAnswers([])
            setIsChecked(false)
            return
        }
        const userAnswer = localHistory.find((item) => item.session === hash)?.answers.find((answer) => answer.id === questions[currentIndex + 1]._id)?.value

        if (!userAnswer) {
            setIsChecked(false)
            debouncedSetDisabled(false)
        } else {
            debouncedSetDisabled(true)
        }

        debouncedSetCurrentIndex(currentIndex + 1)
        //setCurrentIndex(currentIndex + 1);
        debouncedSetQuestion(questions[currentIndex + 1])
        //setCurrentQuestion(questions[currentIndex + 1])
        //setIsChecked(false)


    }

    const onPrevClick = () => {
        setCurrentIndex(currentIndex - 1);
        debouncedSetQuestion(questions[currentIndex - 1])
        setIsChecked(true)
        debouncedSetDisabled(true)
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

        if (answersHistory.length > 0) {
            const session = answersHistory.find((history) => history.session === hash)
            if (session) {
                const index = answersHistory.indexOf(session)
                answersHistory[index].answers = userAnswers
            } else {
                answersHistory.push({session: hash, answers: userAnswers, questionsCount: questionsCount})
            }

            setAnswersHistory(answersHistory)
        } else {
            answersHistory.push({session: hash, answers: userAnswers, questionsCount: questionsCount})
            setAnswersHistory(answersHistory)
        }

        localStorage.setItem('testHistory', JSON.stringify(answersHistory))

        setIsDisabled(true)
        debouncedCheck(true)
    }

    const startAgain = () => {
        setCurrentIndex(0);
        setCurrentQuestion(questions[0])
        setIsEnded(false)
        setHash('')
        setUserAnswers([])
        setIsDisabled(false)
        setIsChecked(false)
    }

    const countCorrectAnswers = () => {
        const correctAnswers = answersHistory.at(-1).answers.filter((item) => item.isCorrect === true).length
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
                                <div className="fs-2 fw-semibold text-center">Правильных ответов:</div>
                                <div className={`fs-2 text-center ${correctAnswersCount >= questionsCount/2 ? 'text-success' : 'text-danger'}`}>{correctAnswersCount}/{questionsCount}</div>
                            </div>
                            <div aria-label="Basic example" className="d-grid mb-3 gap-0 column-gap-3 d-md-flex">
                                <Button variant="outline-dark" className="me-2 w-100" onClick={() => navigate('/')}>
                                    На главную
                                </Button>
                                <Button variant="outline-dark" className="me-2 w-100" onClick={startAgain}>Пройти еще раз</Button>
                            </div>
                        </>
                    ) : (
                        questionsCount > 0 ? (
                            <>
                                <div className="mb-5">
                                    <div className="text-center mb-2">{currentIndex + 1}/{questions.length}</div>
                                    <TestQuestion key={currentQuestion.id} index={currentQuestion._id} title={currentQuestion.title}
                                                  answers={currentQuestion.answers} onChange={onAnswerChange} isDisabled={isDisabled} hash={hash}/>
                                </div>
                                <div aria-label="Basic example" className="d-grid mb-3 gap-0 column-gap-3 d-md-flex">
                                    <Button variant="outline-dark" className="me-2 w-100" onClick={onPrevClick}
                                            disabled={currentIndex === 0}>Предыдущий вопрос</Button>
                                    <Button variant="outline-dark" className="me-2 w-100" onClick={onNextClick} disabled={!isChecked}>{
                                        currentIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'
                                    }</Button>
                                </div>
                            </>
                        ) : (
                            <NoQuestionsFound/>
                        )
                    )}
                    </TestContainer>
            )}


        </>


    )
}