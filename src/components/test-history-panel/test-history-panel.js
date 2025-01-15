import {ProgressBar} from "react-bootstrap";


export const TestHistoryPanel = ({index, item}) => {

    console.log(item)

    const date = `${item.session.slice(8,10)}.${item.session.slice(5,7)}.${item.session.slice(0,4)}`
    const time = item.session.slice(11,19)

    const answers = item.answers;

    const correctAnswers = item.answers.filter((answer) => answer.isCorrect === true).length
    const answersCount = item.answers.length

    const progressBarSeparator = 100 / answersCount


    /*const renderProgressBar = () => {
        return (

        )
    }*/

    return (
        <div>
            <div className="border border-black rounded rounded-4 d-flex justify-content-between align-items-center p-3 mb-3">
                <div className="date-info">
                    <div>{date}</div>
                    <div>{time}</div>
                </div>

                <ProgressBar style={{width: "300px"}}>
                    {
                        answers?.map((answer, index) => (
                            <ProgressBar key={index} variant={answer.isCorrect ? "success" : "danger"} now={progressBarSeparator}></ProgressBar>
                        ))
                    }
                </ProgressBar>

                <div>Верно: {correctAnswers} из {answersCount}</div>
            </div>
        </div>
    )
}