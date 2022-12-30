import React from 'react';
import {
    BrowserRouter,
    Routes, // instead of "Switch"
    Route,
} from "react-router-dom";

import Cadastro from '../../pages/Cadastro';
import Login from '../../pages/Login';

export default function AuthNavigation() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Cadastro" element={<Cadastro />} /> 
            </Routes>
        </BrowserRouter>
    );
}