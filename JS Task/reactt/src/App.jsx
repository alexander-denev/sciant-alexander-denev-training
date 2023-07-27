import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Home from './pages/home';
import Login from './pages/login';

import './style.css';

// <LoginHandler />;
function App() {
  // Access token an persistance across a session
  const [accessToken, setAccessToken] = useState(() => JSON.parse(sessionStorage.getItem('accessToken')));
  useEffect(() => {
    sessionStorage.setItem('accessToken', JSON.stringify(accessToken));
  }, [accessToken]);

  return !accessToken ? (
    <Routes>
      <Route path="/login" element={<Login setAccessToken={setAccessToken} />} />
      <Route path="/*" element={<Navigate to="/login" />} />
    </Routes>
  ) : (
    <Routes>
      <Route path="/home" element={<Home accessToken={accessToken} setAccessToken={setAccessToken}/>} />
      <Route path="/*" element={<Navigate to="/home" />} />
    </Routes>
  );
}

export default App;
