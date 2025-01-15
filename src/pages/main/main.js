import {Button, ButtonGroup, Col, Container, Row} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";
import {TestHistory} from "../../components";
import styled from "styled-components";

const MainContainer = styled.div`
    min-width: 600px;
`

export const Main = () => {
    return (
        <MainContainer className="d-flex flex-column justify-content-center">
            <ButtonGroup aria-label="Basic example" className="mb-4 grid gap-0 column-gap-3">
                <Link to="/test" className="w-100">
                    <Button variant="outline-dark" className="me-2 w-100">Запустить тест</Button>
                </Link>
                <Link to="/test/edit" className="w-100">
                    <Button variant="outline-dark" className="me-2 w-100">Редактировать тест</Button>
                </Link>
            </ButtonGroup>
            <TestHistory/>
        </MainContainer>
    )
}