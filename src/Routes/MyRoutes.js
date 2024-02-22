
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Signup from '../pages/Signup';
import { AuthContext } from '../context/AuthContext';


const MyRoutes = () => {
  const {authUser} = useContext(AuthContext)
  return (
    <Routes>
        <Route path="/" exact element={authUser ? <Home/> : <Login/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <Signup/>} />
    </Routes>
  );
}

export default MyRoutes;
