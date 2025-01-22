import {Routes, Route, Router} from "react-router-dom";
import styled from "styled-components";
import {Main, Test, TestEdit} from "./pages";
import './index.css'

const Page = styled.div`
    min-height: 100vh;
    margin-top: 40px;
`

export const App = () => {

  return (
      <Page className="d-flex justify-content-center align-items-center">
          <Routes>
              <Route path="/" element={<Main/>}></Route>
              <Route path="/test" element={<Test/>}></Route>
              <Route path="/test/edit" element={<TestEdit/>}></Route>
          </Routes>
      </Page>

  );
}