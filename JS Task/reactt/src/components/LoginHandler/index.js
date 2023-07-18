import React, { useEffect, useState } from 'react';

import LoggedInPage from '../LoggedInPage';
import LoginForm from './LoginForm';

export default function LoginHandler() {
  const [accessToken, setAccessToken] = useState(() => JSON.parse(sessionStorage.getItem('accessToken')));

  useEffect(() => {
    sessionStorage.setItem('accessToken', JSON.stringify(accessToken));
  }, [accessToken]);

  if (accessToken) {
    return <LoggedInPage accessToken={accessToken} setAccessToken={setAccessToken} />;
  } else {
    return <LoginForm setAccessToken={setAccessToken} />;
  }
}
