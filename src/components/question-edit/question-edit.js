import {Accordion, Button, Form} from "react-bootstrap";
import {use, useEffect, useMemo, useState} from "react";
import {OptionEdit} from "../option-edit/option-edit";
import {deleteQuestion, getQuestionOptions, updateQuestion} from "../../api";
import {debounce} from "../../utils";
import {Overlay} from '../overlay/overlay'

export const QuestionEdit = ({question, setShouldRefreshQuestions}) => {
    const {_id: id, answers, title} = question;


    const [titleValue, setTitleValue] = useState(title);
    const [isDeleting, setIsDeleting] = useState(false);
    const [questionData, setQuestionData] = useState(question);
    const [shouldRefreshOptions, setShouldRefreshOptions] = useState(false)
    const [options, setOptions] = useState(answers);
    //const [questionBackup, setQuestionBackup] = useState(question)
    //const [isCorrect, setIsCorrect] = useState()
    const [isCreatingNewOption, setIsCreatingNewOption] = useState(false)
    const [newOptionValue, setNewOptionValue] = useState('')


    console.log(questionData)



    useEffect(() => {
        console.log('use eff')
        sessionStorage.setItem(`questionBackup-${id}`, JSON.stringify(question))
        setOptions([...questionData.answers])
    }, [])

    useEffect( () => {
        async function fetchQuestion() {
            console.log('refreshing')
            if (shouldRefreshOptions) {
                getQuestionOptions(id).then((res) => {
                    setOptions(res)
                })
            }
        }

        fetchQuestion().then(() => {
            setShouldRefreshOptions(false)
        })
    }, [shouldRefreshOptions])


    const debouncedDeleteQuestion = useMemo(() => debounce(setIsDeleting, 700), [])

    const onTitleChange = (event) => {
        setTitleValue(event.target.value);
        //questionData.title = event.target.value;
        setQuestionData({...questionData, title: event.target.value}); //todo: -one symbol
        console.log(questionData)

    }

    const onOptionChange = (optionValue, optionId, isOptionCorrect) => {
        //console.log(isCorrect)
        if (isOptionCorrect) {
            questionData.answers.map((item) => item.isCorrect = false)
        }
        questionData.answers.map((item) => {
            if (item._id === optionId) {
                item.text = optionValue
                item.isCorrect = isOptionCorrect
            }
        })
        //questionData.answers.find((item) => item._id === optionId).text = optionValue;

        // questionData.answers.find((item) => item._id === optionId).isCorrect = isOptionCorrect;
        //setIsCorrect(isOptionCorrect)


        //console.log(questionData)
        setQuestionData(questionData);
        setOptions([...options, questionData.answers])
        console.log(options)
        //console.log(options)
        //setShouldRefreshOptions(true)
    }


    const onAccordionOpen = () => {
        console.log('opened')
    }

    const onCancelClick = () => {
        /*console.log(questionBackup)
        setTitleValue(questionBackup.title)
        setOptions(questionBackup.answers)
        setQuestionData(questionBackup)*/
        const QUESTION_BACKUP = JSON.parse(sessionStorage.getItem(`questionBackup-${id}`))
        console.log(QUESTION_BACKUP)
        setTitleValue(QUESTION_BACKUP.title)
        setOptions([...QUESTION_BACKUP.answers])
        setQuestionData(QUESTION_BACKUP)
        setIsCreatingNewOption(false)
    }

    const onSaveQuestionClick = async () => {
        console.log(questionData, 'updating')
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

    const onAddNewOption = () => {
        setIsCreatingNewOption(true)
    }

    const onNewOptionCancel = () => {
        setIsCreatingNewOption(false)
        setNewOptionValue('')
    }

    const onNewOptionChange = (event) => {
        setNewOptionValue(event.target.value)
    }

    const onNewOptionAdd = (event) => {
        if (event.key==='Enter' && event.target.value.trim() !== '') {
            setOptions([...options, {text: newOptionValue, isCorrect: false, _id: String(Math.random())}])
            //options.push({text: newOptionValue, isCorrect: false})
            console.log(options)
            setNewOptionValue('')
            //setIsCreatingNewOption(false)
        }
    }

    const onDeleteOption = (id) => {
        const itemIndex = options.indexOf(options.find((item) => item._id === id))
        //console.log(options, itemIndex)
        console.log(options)
        const newArray = options.filter((item) => item._id !== id)

        setOptions([...newArray])
        console.log(newArray)
        //setQuestionData({...questionData, answers: [...newArray]})
        //setOptions([...questionData.answers])
        //setQuestionData([...questionData, questionData.answers=options])
        console.log(options.filter((item) => item._id !== id))
        console.log(options)
    }
    const debouncedDeleteOption = useMemo(() => debounce(onDeleteOption, 700), [])

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
                            <Button className="w-100 mx-2" variant="outline-dark" title="Добавить вариант ответа" onClick={onAddNewOption} hidden={isCreatingNewOption}>+</Button>
                            { isCreatingNewOption &&
                                <div className="d-flex justify-content-center align-items-center">
                                    <Form.Control className="mx-2 my-2" type="text" placeholder="Введите вариант ответа..." autoFocus value={newOptionValue} onChange={onNewOptionChange} onKeyDown={onNewOptionAdd}/>
                                    <Button variant="outline-dark ms-1" onClick={onNewOptionCancel}>&times;</Button>
                                </div>
                            }
                            {options.length > 0 ? (options.map((option) => (
                                    <OptionEdit option={option} questionID={id} key={option._id} onChange={onOptionChange} setShouldRefreshOptions={setShouldRefreshOptions} isCorrect={option.isCorrect} onDeleteOption={debouncedDeleteOption}/>
                                ))) : (
                                <div className="text-center">Нет вариантов ответа</div>
                            )}
                            <div className="buttons d-flex justify-content-between align-items-center mt-5">
                                <Button variant="light"
                                        className="border-1 border-secondary w-100 me-2" onClick={onCancelClick} title="Отменить все изменения">Отменить</Button>
                                <Button variant="success" className="w-100 me-2" onClick={onSaveQuestionClick} title="Сохранить все изменения">Сохранить</Button>
                                <Button variant="danger" className="w-100" onClick={onDeleteQuestionClick} title="Удалить вопрос">Удалить
                                    вопрос</Button>
                            </div>
                        </Accordion.Body>
                        {isDeleting &&

                            <Overlay>
                                Удаляем вопрос...
                            </Overlay>

                        }
                    </Accordion.Item>
            </Accordion>

        </div>
    )
}