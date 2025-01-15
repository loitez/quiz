import {useEffect, useLayoutEffect, useState} from "react";
import {getQuestions} from "../../api";
import {TestQuestion} from "../../components";
import {Link, useNavigate} from "react-router-dom";
import {Button, ButtonGroup} from "react-bootstrap";
import styled from "styled-components";

const TestContainer = styled.div`
    min-width: 600px;
`

export const Test = () => {

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [isEnded, setIsEnded] = useState(false);
    const [hash, setHash] = useState('')
    const [answersHistory, setAnswersHistory] = useState(JSON.parse(localStorage.getItem('testHistory')) || [])
    const [correctAnswersCount, setCorrectAnswersCount] = useState(null)

    const navigate = useNavigate()


    useEffect(() => {
        getQuestions().then(({questions}) => {
            setQuestions(questions);
            setCurrentQuestion(questions[currentIndex])
        })
        const date = new Date();
        setHash(date.toJSON().slice(0, 19).replace('T', '_'))

    }, []);

    const onNextClick = () => {
        if (currentIndex === questions.length - 1) {
            setIsEnded(true)
            answersHistory.push({ session: hash, answers: userAnswers })
            setAnswersHistory(answersHistory)
            localStorage.setItem('testHistory', JSON.stringify(answersHistory))
            countCorrectAnswers()
            setHash('')
            setUserAnswers([])
        }

        setCurrentIndex(currentIndex + 1);
        setCurrentQuestion(questions[currentIndex + 1])
    }

    const onPrevClick = () => {
        setCurrentIndex(currentIndex - 1);
        setCurrentQuestion(questions[currentIndex - 1])
    }

    const onAnswerChange = (isCorrect, questionID) => {

        const answer = userAnswers.find((element) => element.id === questionID)
        if (answer) {
            const index = userAnswers.indexOf(answer)
            userAnswers[index].isCorrect = isCorrect
            setUserAnswers(userAnswers)
        } else {
            userAnswers.push({
                id: questionID,
                isCorrect: isCorrect
            })
            setUserAnswers(userAnswers)
        }
    }

    const startAgain = () => {
        setCurrentIndex(0);
        setCurrentQuestion(questions[0])
        setIsEnded(false)
    }

    const countCorrectAnswers = () => {
        const correctAnswers = answersHistory.at(-1).answers.filter((item) => item.isCorrect === true).length
        setCorrectAnswersCount(correctAnswers)
    }

    return (
        <TestContainer className="d-flex flex-column mw-100">

            { isEnded ? (
                <>
                <div className="mb-5">
                    <div>Правильных ответов:</div>
                    <div>{correctAnswersCount}/{questions.length}</div>
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
                                      answers={currentQuestion.answers} onChange={onAnswerChange}/>
                    </div>
                    <div aria-label="Basic example" className="d-grid mb-3 gap-0 column-gap-3 d-md-flex">
                    <Button variant="outline-dark" className="me-2 w-100" onClick={onPrevClick}
                                disabled={currentIndex === 0}>Предыдущий вопрос</Button>
                        <Button variant="outline-dark" className="me-2 w-100" onClick={onNextClick}>{
                            currentIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'
                        }</Button>
                    </div>
                </>

            )


            }


            {/*{questions.length > 0 ? (
                <div>
                    {questions.map(({id, title, answers}, index) => (
                        <>
                            <div>{index + 1}/{questions.length}</div>
                            <TestQuestion key={id} title={title} answers={answers}/></>
                    ))}
                </div>
            ) : (<div>Нет вопросов теста</div>)}*/}


        </TestContainer>
    )
}