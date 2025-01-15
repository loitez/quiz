import {Form} from "react-bootstrap";
import {useEffect} from "react";

export const TestQuestion = ({index: questionID, title, answers, onAnswerChange}) => {


    useEffect(() => {

    }, [])


    return (
        <Form>
            <div className="mb-3 text-center">{title}</div>
            {answers?.map((answer, index) => (
                    <Form.Check key={index} label={answer.text} name={`question-${questionID}`} type="radio" id={`radio-${index}`} onChange={onAnswerChange} className="mb-1"/>
                )
            )}
        </Form>
    )
}