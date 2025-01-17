import {Accordion, Spinner} from "react-bootstrap";
import styled from "styled-components";
import {useEffect, useState} from "react";
import {getQuestions} from "../../api";
import {NoQuestionsFound, QuestionEdit} from "../../components";
import {alignPropType} from "react-bootstrap/types";

const TestEditContainer = styled.div`
    width: 600px;
`

export const TestEdit = () => {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [shouldRefreshQuestions, setShouldRefreshQuestions] = useState(false)


    useEffect(() => {
        getQuestions()
            .then(({questions = []}) => {
            setQuestions(questions);
            setIsLoading(false)
            setShouldRefreshQuestions(false)
        })
            .catch((err) => console.error(err))

    }, [shouldRefreshQuestions]);

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
                                { questions.map((question) => (
                                    <QuestionEdit key={question._id} question={question} setShouldRefreshQuestions={setShouldRefreshQuestions}/>
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