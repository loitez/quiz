import {Accordion, Alert, Button, Form} from "react-bootstrap";
import {useEffect, useMemo, useState} from "react";
import {OptionEdit} from "../option-edit/option-edit";
import {getQuestionOptions, updateQuestion} from "../../api";
import {debounce} from "../../utils";
import {Overlay} from '../overlay/overlay'
import { v4 as uuidv4 } from 'uuid';
import {Controller, useFieldArray, useForm} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

export const QuestionEdit = ({question, setShouldRefreshQuestions, onDeleteQuestion}) => {
    const {_id: id, answers, title} = question;

    const [titleValue, setTitleValue] = useState(title);
    const [isDeleting, setIsDeleting] = useState(false);
    const [questionData, setQuestionData] = useState(question);
    const [shouldRefreshOptions, setShouldRefreshOptions] = useState(false)
    const [options, setOptions] = useState(questionData.answers);
    const [isCreatingNewOption, setIsCreatingNewOption] = useState(false)
    const [newOptionValue, setNewOptionValue] = useState('')
    const [isAlertVisible, setIsAlertVisible] = useState(false)
    const [alertVariant, setAlertVariant] = useState(null)


    const validationSchema = yup.object()
        .shape({
            title: yup
                .string()
                .required('Введите текст вопроса'),
            options: yup.array().of(
                yup.object().shape({
                    text: yup.string().required('Поле обязательно для заполнения')
                })
            ).test("at-least-one-filled", "Должен быть хотя бы один вариант ответа", (options) => {
                return options.some(option => option.text.trim() !== '');
            })
           /* options: yup.array().of(
                yup.object().shape({
                    optionTitle: yup
                        .string()
                        .required('Введите текст варианта ответа')
                })
            ).required('Хотя бы один вариант ответа')*/
        })

    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
    } = useForm({
        defaultValues: {
            title: titleValue,
            options: question.answers,
        },
        resolver: yupResolver(validationSchema)
    })

    const { fields, append, remove, move  } = useFieldArray({
        control,
        name: 'options'
    });


    const titleError = errors.title?.message

    const optionTitleError = errors.optionTitle?.message
    console.log(errors.options)
    const optionsError = errors.options?.message
    const optionTextError = errors.optons[0]?.text?.message

    const anyError = errors

    let hasError = !!(titleError || optionTitleError)

    useEffect(() => {
        sessionStorage.setItem(`QUESTION-${id}_BACKUP`, JSON.stringify(question));
    }, [])

    let QUESTION_BACKUP = JSON.parse(sessionStorage.getItem(`QUESTION-${id}_BACKUP`))

    useEffect( () => {
        async function fetchQuestion() {
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

    useEffect(() => {
        if (options.length > 0 && !checkCorrectOptionExists(options)) {
            console.log('no correct answer')
            autoSetCorrectOption(options)
        }
    }, [options])


    const debouncedDeleteQuestion = useMemo(() => debounce(setIsDeleting, 800), [])
    const debouncedDeleteOption = useMemo(() => debounce(setOptions, 700), [])
    const debouncedHideAlert = useMemo(() => debounce(setIsAlertVisible, 700), [])
    const debouncedResetAlertVariant = useMemo(() => debounce(setAlertVariant, 700), [])

    const onTitleChange = (event) => {
        console.log('title change')
        setTitleValue(event.target.value);
        questionData.title = event.target.value;
        setQuestionData(questionData);
    }

    const onOptionChange = (optionValue, optionId, isOptionCorrect) => {
        console.log('option clicked - ', optionValue, optionId, isOptionCorrect)
        if (isOptionCorrect) {
            questionData.answers.map((item) => item.isCorrect = false)
        }
        questionData.answers.map((item) => {
            if (item.id === optionId) {
                item.text = optionValue
                item.isCorrect = isOptionCorrect
            }
        })
        setQuestionData({...questionData});
        setOptions([...questionData.answers])
    }


    const onAccordionOpen = () => {
        console.log('opened')
    }

    const onCancelClick = () => {

        setTitleValue(QUESTION_BACKUP.title)
        setOptions([...QUESTION_BACKUP.answers])
        setQuestionData({...QUESTION_BACKUP})
    }

    const onSaveQuestionClick = async (event) => {

        console.log('clicked')

        let response = await updateQuestion(questionData)
        if (response?.error) {
            console.log(response.error)
            showAndHideAlert("danger")
           return
        }
        showAndHideAlert("success")
        console.log(response)

        sessionStorage.setItem(`QUESTION-${id}_BACKUP`, JSON.stringify(question));
    }

    const onDeleteQuestionClick = async () => {
        console.log(questionData)
        let idForDeleting = question._id || question.id
        let isInDb = !!question._id
        console.log(isInDb)
        onDeleteQuestion(isInDb, idForDeleting)
        /*if (question._id) {
            try {
                await deleteQuestion(id)
            } catch (err) {
                console.error(err)
            }
        }*/
        setIsDeleting(true)

        await debouncedDeleteQuestion(false)
        /*if (question._id) {
            setShouldRefreshQuestions(true)
        }*/



    }

    const onNewOptionCancel = () => {
        setIsCreatingNewOption(false)
        setNewOptionValue('')
    }

    const onNewOptionChange = (event) => {
        setNewOptionValue(event.target.value)
    }

    const onNewOptionAdd = (event) => {
        const updatedOptions = [...options, {id: uuidv4(), text: newOptionValue, isCorrect: false}]
        setOptions(updatedOptions)
        setQuestionData({...questionData, answers: updatedOptions})
        setNewOptionValue('')
        setIsCreatingNewOption(false)
    }

    const onDeleteOption = (id) => {
        console.log(id)
        const updatedOptions = options.filter((item) => item.id !== id)
        debouncedDeleteOption(updatedOptions)
        setQuestionData({...questionData, answers: updatedOptions})
    }

    const checkCorrectOptionExists = (options) => {
        const index = options.indexOf(options.find((item) => item.isCorrect === true))
        return index > -1
    }

    const autoSetCorrectOption = (options) => {
        const firstElement = options[0];
        const updatedOptions = options.slice(1)
        firstElement.isCorrect = true;
        setOptions([firstElement, ...updatedOptions])
    }

    const showAndHideAlert = (variant) => {
        setAlertVariant(variant)
        setIsAlertVisible(true)
        debouncedHideAlert(false)
        debouncedResetAlertVariant('')
    }

    console.log(errors)


    return (
        <div className="mb-4">
            {isAlertVisible && <Alert variant={alertVariant}>{
                alertVariant === "success" ? "Вопрос успешно сохранен" : "Что-то пошло не так"
            }</Alert>}
            <form onSubmit={handleSubmit(onSaveQuestionClick)}>
                <Accordion defaultActiveKey="0" className="mb-2">
                    <Accordion.Item eventKey="0" className={`position-relative ${alertVariant === 'success' && "success-save"} ${alertVariant === "danger" && "error-save"}`}>
                        <Accordion.Header onClick={onAccordionOpen} className={`position-relative ${titleError && "error-wrapper"}`}>
                            <Form.Control className="mx-2" type="text" placeholder="Введите вопрос..."
                                          {...register('title', {onChange: onTitleChange, value: titleValue})}
                            />
                            {errors.title && <p className="error">{errors.title.message}</p>}
                        </Accordion.Header>
                        <Accordion.Body>
                            <div className="mb-2">
                                <Button className="w-100 mx-2" variant="outline-dark" title="Добавить вариант ответа"
                                        onClick={() => setIsCreatingNewOption(true)} hidden={isCreatingNewOption}>
                                    <i className="bi bi-plus-lg"></i>
                                </Button>
                                { isCreatingNewOption &&
                                    <div className="d-flex justify-content-center align-items-center">
                                        <Form.Control className="mx-2" type="text" placeholder="Введите вариант ответа..." autoFocus
                                                      {...register('optionTitle', {onChange: onNewOptionChange, value: newOptionValue})}
                                        />
                                        <div className="buttons option-edit-buttons d-flex justify-content-between align-items-center">
                                            <Button variant="outline-dark me-1" onClick={onNewOptionAdd} title="Добавить вариант ответа">
                                                <i className="bi bi-arrow-down"></i>
                                            </Button>
                                            <Button variant="outline-dark ms-2" onClick={onNewOptionCancel} title="Закрыть режим добавления варианта ответа">
                                                <i className="bi bi-x-lg"></i>
                                            </Button>
                                        </div>

                                    </div>
                                }
                            </div>


                            {options.length > 0 ?

                                options.map((option, index) => (
                                        <div key={index}>
                                            <OptionEdit option={option} questionID={id} key={option.id} onChange={onOptionChange} setShouldRefreshOptions={setShouldRefreshOptions} onDeleteOption={onDeleteOption} {...register(`options.${index}.text`)}/>

                                        </div>
                                    ))

                                : (
                                <div className="text-center mt-4">Нет вариантов ответа</div>
                            )}
                            <div>
                                {errors.options && optionsError && (
                                    <p className="option-error">{optionsError}</p>
                                )}
                            </div>
                            <div className="buttons d-flex justify-content-between align-items-center mt-4">
                                <Button variant="light"
                                        className="border-1 border-secondary w-100 me-2" onClick={onCancelClick}>Отменить</Button>
                                <Button variant="success" className="w-100 me-2" type="submit">Сохранить</Button>
                                <Button variant="danger" className="w-100" onClick={onDeleteQuestionClick}>Удалить
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
            </form>

        </div>
    )
}