import {Accordion, Button, ButtonGroup, Spinner} from "react-bootstrap";
import styled from "styled-components";
import {useEffect, useState} from "react";
import {getQuestions} from "../../api";
import {NoQuestionsFound, QuestionEdit} from "../../components";
import {alignPropType} from "react-bootstrap/types";
import {Link} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const TestEditContainer = styled.div`
    width: 600px;
`

export const TestEdit = () => {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [shouldRefreshQuestions, setShouldRefreshQuestions] = useState(false)


    useEffect(() => {
        getQuestions()
            .then((questions = []) => {
            setQuestions(questions);
            setIsLoading(false)
            setShouldRefreshQuestions(false)
            console.log(questions)
        })
            .catch((err) => console.error(err))

    }, [shouldRefreshQuestions]);

    const onAddNewQuestionClick = () => {
        const newQuestion = {
            id: uuidv4(),
            title: '',
            answers: [{id: uuidv4(), text: '', isCorrect: true}]
        }
        setQuestions([...questions, newQuestion])
        console.log(newQuestion)
    }

    return (
        <>
            {
                isLoading ? (
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                ) : (
                     questions.length > 0 ? (
                            <TestEditContainer>
                                <ButtonGroup aria-label="Basic example" className="mb-4 grid gap-0 column-gap-3 w-100">
                                    <Link to="/" className="w-100">
                                        <Button variant="outline-dark" className="me-2 w-100">На главную</Button>
                                    </Link>
                                    <Link to="/test" className="w-100">
                                        <Button variant="outline-dark" className="me-2 w-100">Запустить тест</Button>
                                    </Link>
                                </ButtonGroup>
                                <Button variant="primary" className="me-2 w-100 mb-4" onClick={onAddNewQuestionClick}>Добавить вопрос</Button>
                                { questions.map((question) => (
                                    <QuestionEdit key={question.id} question={question} setShouldRefreshQuestions={setShouldRefreshQuestions}/>
                                ))}
                            </TestEditContainer>
                        ) : (
                            <NoQuestionsFound/>
                        )
                )
            }
        </>
    )
}