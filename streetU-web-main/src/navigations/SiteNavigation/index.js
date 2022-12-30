import React from 'react';
import {
    BrowserRouter,
    Routes, // instead of "Switch"
    Route,
} from "react-router-dom";
import AddImage from '../../pages/AddImage';
import CreateList from '../../pages/CreateList';
import Galeria from '../../pages/Galeria';
import { Home } from '../../pages/Home'; 
import SaveImage from '../../pages/SaveImage';

export default function SiteNavigation() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/addImage" element={<AddImage />} /> 
                <Route path="/SaveImage" element={<SaveImage />} /> 
                <Route path="/createList" element={<CreateList />} /> 
                <Route path="/galeria" element={<Galeria />} /> 
            </Routes>
        </BrowserRouter>
    );
}