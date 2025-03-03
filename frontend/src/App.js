// frontend\src\App.js
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Matching from './pages/Matching';
import Options from './pages/Options';
import Marketplace from './pages/Marketplace';
import Companionship from './pages/Companionship';
import Forum from './pages/Forum';
import Gamification from './pages/Gamification';
import Profile from './pages/Profile';
import RefrshHandler from './RefrshHandler';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      {isAuthenticated && <Navbar />}

      <Routes>
        {/* Authentication Pages */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile' element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />

        {/* Scrollable Pages */}
        <Route path='/' element={<Navigate to="/home" />} />
        <Route path='/home' element={isAuthenticated ? <ScrollablePages /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

function ScrollablePages() {
  return (
    <div className="scroll-container">
      <section id="home"><Home /></section>
      <section id="matching"><Matching /></section>
      <section id="options"><Options /></section>
      <section id="marketplace"><Marketplace /></section>
      <section id="companionship"><Companionship /></section>
      <section id="forum"><Forum /></section>
      <section id="gamification"><Gamification /></section>
      <section id="footer"><Footer/></section>
    </div>
  );
}

export default App;
