import {Routes, Route, Router} from "react-router-dom";
import styled from "styled-components";
import {Main} from "./pages";

const Page = styled.div`
    min-height: 100vh;
    min-width: 100vw;
`

export const App = () => {

  return (
      <Page className="d-flex justify-content-center align-items-center">
          <Routes>
              <Route path="/" element={<Main/>}></Route>
              <Route path="/test" element={<p>Прохождение</p>}></Route>
              <Route path="/test/edit" element={<p>Редактирование</p>}></Route>
          </Routes>
      </Page>

  );
}