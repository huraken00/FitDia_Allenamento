import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import HomePage from "./Homepage";
import Register from "./user/pages/Register";
import Login from "./user/pages/Login";
import LoginDirettore from "./director/pages/login";
import LoginUser from "./user/pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loginDirettore" element={<LoginDirettore />} />
       < Route path="/loginUser" element={<LoginUser />} />
      </Routes>
    </Router>
  );
}

export default App;