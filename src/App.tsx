import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import DogSearchPage from './pages/DogSearchPage/DogSearchPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/search" element={<DogSearchPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
