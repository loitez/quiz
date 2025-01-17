import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

export const NoQuestionsFound = () => {
    const navigate = useNavigate()

    return (
        <div className="d-flex flex-column align-items-center">
            <div className="mb-4 text-center fs-5">Кажется, в тесте нет вопросов :(</div>
            <Button variant="outline-dark" onClick={() => navigate('/')}>Вернуться на главную</Button>
        </div>
    )
}