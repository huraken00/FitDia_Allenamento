import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import HomePage from "./Homepage";
import LoginDirettore from "./director/pages/login";
import LoginUser from "./user/pages/Login";
import RegisterUser from "./user/pages/Register";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
       < Route path="/loginUser" element={<LoginUser />} />
       < Route path="/registerUser" element={<RegisterUser />} />
       <Route path="/loginDirettore" element={<LoginDirettore />} />
      </Routes>
    </Router>
  );
}

export default App;