import React, { useEffect, useState, Suspense } from 'react';

import LoginForm from './LoginForm';
const LoggedInPage = React.lazy(() => import('../LoggedInPage'));

export default function LoginHandler() {
  const sessionStorageAccessToken = JSON.parse(sessionStorage.getItem('accessToken'));
  const [accessToken, setAccessToken] = useState(sessionStorageAccessToken);
  useEffect(() => {
    sessionStorage.setItem('accessToken', JSON.stringify(accessToken));
  }, [accessToken]);

  if (accessToken) {
    return (
      <>
        <Suspense fallback={
            <div>Loading...</div>
          }>
          <LoggedInPage accessToken={accessToken} />
        </Suspense>

        <button onClick={() => setAccessToken(null)}>Log Out</button>
      </>
    );
  } else {
    return <LoginForm setAccessToken={setAccessToken} />;
  }
}
