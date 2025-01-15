import {getQuestions} from "../../api";
import {useEffect, useLayoutEffect, useState} from "react";

export const TestHistory = () => {


    return (
        <>
            <div className="mb-2">История прохождений</div>
            <div className="border border-black rounded rounded-4 d-flex justify-content-between p-3">
                <div>01</div>
                <div>Progress Bar</div>


                <div>Верно</div>
            </div>
        </>
    )
}