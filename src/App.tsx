import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './styles/App.css';
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import "./styles/fonts.css";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/registration" element={localStorage.getItem("jwt") === null ?
                        <Registration/> : <Home/>}/>
                    <Route path="/login" element={localStorage.getItem("jwt") === null ?
                        <Login/> : <Home/>}/>
                    <Route path="*" element={<PageNotFound/>}/>
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;