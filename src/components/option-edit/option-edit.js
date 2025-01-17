import {Button, Form} from "react-bootstrap";
import {useState} from "react";
import {deleteOption} from "../../api";

export const OptionEdit = ({option, questionID, onChange: sendValueToParent}) => {
    console.log(option)
    const [optionValue, setOptionValue] = useState(option.text)

    const onOptionChange = (event) => {
        setOptionValue(event.target.value)
        sendValueToParent(event.target.value, option._id)
    }
    const onSetCorrectAnswerChange = () => {

    }

    const onDeleteOptionClick = async () => {
        console.log(option)
        console.log(option._id)
        //await deleteOption(questionID, option._id)
    }

    const correctAnswerLabel = <i className="bi bi-check2"></i>

    return (
        <div className="d-flex justify-content-between align-items-center">
            <Form.Control className="mx-2 my-2" type="text" placeholder="Введите вариант ответа..." value={optionValue}
                          onChange={onOptionChange}/>
            <div className="buttons option-edit-buttons d-flex justify-content-between align-items-center">
                <Form.Check
                    type="radio"
                    label={correctAnswerLabel}
                    id={`option-${option.id}`}
                    name={`option-${questionID}`}
                    className="option-set-correct-btn px-0"
                    onChange={onSetCorrectAnswerChange}
                    checked={option.isCorrect}
                    title="Отметить верным"
                />
                <Button variant="outline-danger rounded-5" title="Удалить этот вариант" onClick={onDeleteOptionClick}>
                    <i className="bi bi-trash3"></i>
                </Button>
            </div>
        </div>
    )
}