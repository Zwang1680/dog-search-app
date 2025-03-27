import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import DogSearchPage from './pages/DogSearchPage/DogSearchPage';
import { createTheme, CssBaseline } from '@mui/material';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/search" element={<DogSearchPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
