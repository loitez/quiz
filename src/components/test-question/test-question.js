import {Form} from "react-bootstrap";
import {useEffect, useMemo, useState} from "react";
import {debounce} from "../../utils";

const changeButtonColor = (isCorrect, event) => {
    if (isCorrect) {
        changeButton(event, 'green')
    } else {
        changeButton(event, 'red')
    }
}

const resetButtonColor = (event) => {
    changeButton(event, null)
}

const changeButton = (btn, color) => {
    btn.target.style.backgroundColor = color
    btn.target.style.borderColor = color
}


export const TestQuestion = ({index: questionID, title, answers, onChange: onAnswerChange, isDisabled, userAnswer}) => {

    const [value, setValue] = useState(userAnswer || '');
    const debouncedChangeColor = useMemo(() => debounce(changeButtonColor, 200), [])
    const debouncedResetColor = useMemo(() => debounce(resetButtonColor, 600), [])

    useEffect(() => {
    }, [])


    const onRadioChange = (answer, event)  => {
        setValue(event.target.value)
        onAnswerChange(answer.isCorrect, questionID, event.target.value)
        debouncedChangeColor(answer.isCorrect, event)
        debouncedResetColor(event)
    }


    return (
        <Form>
            <div className="mb-3 text-center">{title}</div>
            {answers?.map((answer, index) => (
                    <Form.Check key={index} label={answer.text} name={`question-${questionID}`} type="radio" id={`radio-${index}`} value={answer.text} checked={value === answer.text} onChange={(event) => onRadioChange(answer, event)} disabled={isDisabled} className="mb-1"/>
                )
            )}
        </Form>
    )
}