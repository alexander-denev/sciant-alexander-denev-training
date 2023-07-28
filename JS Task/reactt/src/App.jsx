import React, { useEffect, useState } from 'react';

import Home from './pages/home';
import Login from './pages/login';

import './style.css';

function App() {
  // Access token an persistance across a session
  const [accessToken, setAccessToken] = useState(() => JSON.parse(sessionStorage.getItem('accessToken')));
  useEffect(() => {
    sessionStorage.setItem('accessToken', JSON.stringify(accessToken));
  }, [accessToken]);

  return accessToken ? (
    <Home accessToken={accessToken} setAccessToken={setAccessToken} />
  ) : (
    <Login setAccessToken={setAccessToken} />
  );
}

export default App;
