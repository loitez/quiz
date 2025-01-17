import {Accordion, Button, Form} from "react-bootstrap";
import {useEffect, useMemo, useState} from "react";
import {OptionEdit} from "../option-edit/option-edit";
import {deleteQuestion, updateQuestion} from "../../api";
import {debounce} from "../../utils";

export const QuestionEdit = ({question, setShouldRefreshQuestions}) => {
    const {_id: id, answers, title} = question;

    const [titleValue, setTitleValue] = useState(title);
    const [isDeleting, setIsDeleting] = useState(false);
    const [questionData, setQuestionData] = useState(question);


    const debouncedDeleteQuestion = useMemo(() => debounce(setIsDeleting, 700), [])

    const onTitleChange = (event) => {
        setTitleValue(event.target.value);
        questionData.title = event.target.value;
        setQuestionData(questionData);
    }

    const onOptionChange = (optionValue, optionId) => {
        questionData.answers.find((item) => item._id === optionId).text = optionValue;
        console.log(questionData)
        setQuestionData(questionData);
    }


    const onAccordionOpen = () => {
        console.log('opened')
    }

    const onSaveQuestionClick = async () => {
        await updateQuestion(questionData)
    }

    const onDeleteQuestionClick = async () => {

        setIsDeleting(true)
        try {
            await deleteQuestion(id)
        } catch (err) {
            console.error(err)
        }
        await debouncedDeleteQuestion(false)
        setShouldRefreshQuestions(true)

    }

    return (
        <div className="mb-4">
            <Accordion defaultActiveKey="0" className="mb-2">
                    <Accordion.Item eventKey="0" className="position-relative">
                        <Accordion.Header onClick={onAccordionOpen}>
                            <Form.Control className="mx-2" type="text" placeholder="Введите вопрос..."
                                          value={titleValue}
                                          onChange={onTitleChange}/>
                        </Accordion.Header>
                        <Accordion.Body>
                            {answers.map((option) => (
                                <OptionEdit option={option} questionID={id} key={option._id} onChange={onOptionChange}/>
                            ))}
                            <div className="buttons d-flex justify-content-between align-items-center mt-5">
                                <Button variant="light"
                                        className="border-1 border-secondary w-100 me-2">Отменить</Button>
                                <Button variant="success" className="w-100 me-2" onClick={onSaveQuestionClick}>Сохранить</Button>
                                <Button variant="danger" className="w-100" onClick={onDeleteQuestionClick}>Удалить
                                    вопрос</Button>
                            </div>
                        </Accordion.Body>
                        {isDeleting &&
                            <>
                                <div className="overlay position-absolute top-0 start-0 bottom-0 end-0 bg-white"></div>
                                <div
                                    className="text-center position-absolute z-2 top-50 start-50 translate-middle fs-5">Удаляем
                                    вопрос...
                                </div>
                            </>
                        }
                    </Accordion.Item>
            </Accordion>

        </div>
    )
}