import React from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "./context/authContext";
import UserLogin from "./login";
import UserSignup from "./signup";
import Task from "./task";


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<UserLogin />} />
          <Route path="/" element={<UserSignup />} />
          <Route path="/tasks" element={<Task />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
