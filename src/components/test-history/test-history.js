import {getQuestions} from "../../api";
import {useEffect, useLayoutEffect, useState} from "react";
import {TestHistoryPanel} from "../test-history-panel/test-history-panel";

export const TestHistory = () => {

    //const [questionsCount, setQuestionsCount] = useState(0);

    let testHistory = JSON.parse(localStorage.getItem("testHistory")) || [];


    return (
        <>
            {testHistory.length > 0 ? (
                testHistory.map((item, index) => (
                        <TestHistoryPanel key={index} index={index} item={item}/>
                    ))
            ) : (
                <>

                    <div>
                        <img className="img-not-found" src="no-tests.png" alt="Нет истории тестов"/>
                        <div className="text-center">Ой! Кажется, вы еще не проходили этот тест</div>
                    </div>
                </>
            )}

        </>
    )
}