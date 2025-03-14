import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Feedback from './pages/Feedback';
import Admin from './pages/Admin';
import Topics from './pages/Topics';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes for regular users */}
      <Route 
        path="/feedback" 
        element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
            <Feedback />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin-only routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Admin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/topics" 
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Topics />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default App;
