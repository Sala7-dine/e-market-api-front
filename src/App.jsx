import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import './App.css'
import Register  from "./pages/auth/Register.jsx";
import Login  from "./pages/auth/Login.jsx";
import Home  from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";

function App() {

    // const [data, setData] = useState([])

  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
        </BrowserRouter>

    </>
  )
}

export default App
