import React, { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/navbar';
import Home from './components/home';
import { Route, Routes } from 'react-router-dom';
import LeaderBoard from './components/leaderBoard';
import ImpactDashboard from './components/impactDashboard';
import Profile from './components/profile';
import Footer from './components/footer';
import Login from './components/Login';
import MainPage from './components/Mainpage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductInfo from './components/Productinfo';
import { Toaster } from 'react-hot-toast';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <div>
     
        <>
          <ToastContainer />
          <Toaster/>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leaderboard" element={<LeaderBoard />} />
            <Route path="/impactdashboard" element={<ImpactDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:id" element={<ProductInfo/>} />
          </Routes>
          <Footer />
        </>
    </div>
  );
}

export default App;
