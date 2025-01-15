import {Form} from "react-bootstrap";
import {useEffect, useState} from "react";

export const TestQuestion = ({index: questionID, title, answers, onChange: onAnswerChange}) => {

    const [value, setValue] = useState('');

    useEffect(() => {

    }, [])

    const onRadioChange = (answer, event)  => {
        setValue(event.target.value)
        onAnswerChange(answer.isCorrect, questionID)
    }


    return (
        <Form>
            <div className="mb-3 text-center">{title}</div>
            {answers?.map((answer, index) => (
                    <Form.Check key={index} label={answer.text} name={`question-${questionID}`} type="radio" id={`radio-${index}`} value={answer.text} checked={value === answer.text} onChange={(event) => onRadioChange(answer, event)} className="mb-1"/>
                )
            )}
        </Form>
    )
}