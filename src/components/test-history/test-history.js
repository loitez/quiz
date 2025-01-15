import {getQuestions} from "../../api";
import {useEffect, useLayoutEffect, useState} from "react";
import {TestHistoryPanel} from "../test-history-panel/test-history-panel";

export const TestHistory = () => {

    let testHistory = JSON.parse(localStorage.getItem("testHistory")) || [];

    return (
        <>
            <div className="mb-3">История прохождений</div>
            {testHistory.length > 0 ? (
                testHistory.map((item, index) => (
                        <TestHistoryPanel key={index} index={index} item={item}/>
                    ))
            ) : (
                <div>Нет истории теста</div>
            )}

        </>
    )
}