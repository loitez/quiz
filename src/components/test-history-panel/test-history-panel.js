import {ProgressBar} from "react-bootstrap";
import {useContext, useEffect} from "react";


export const TestHistoryPanel = ({index, item}) => {

    const date = item.session.split(', ')[0]
    const time = item.session.split(', ')[1]

    const answers = item.answers;

    const correctAnswers = item.answers.filter((answer) => answer.isCorrect === true).length
    const answersCount = item.answers.length

    const questionsCount = item.questionsCount;

    const progressBarSeparator = 100 / questionsCount


    return (
        <div>
            <div className="mb-3 fw-semibold">История прохождений</div>
            <div
                className="border border-black rounded rounded-4 d-flex justify-content-between align-items-center p-3 mb-3">
                <div className="date-info">
                    <div>{date}</div>
                    <div className="text-small">{time}</div>
                </div>
                <div className="progress-bar-container d-flex justify-content-between align-items-center">
                    0
                    <ProgressBar style={{width: "270px"}} className="mx-2 progress-bar-panel">
                        {
                            answers?.map((answer, index) => (
                                <ProgressBar key={index} variant={answer.isCorrect ? "success" : "danger"}
                                             now={progressBarSeparator}></ProgressBar>
                            ))
                        }
                    </ProgressBar>
                    <div
                        className="progress-bar-tooltip border border-black rounded-3 bg-white py-1 px-2">Пройдено: {answersCount} из {questionsCount}</div>
                    {questionsCount}
                </div>


                <div>Верно: {correctAnswers} из {questionsCount}</div>
            </div>
        </div>
    )
}