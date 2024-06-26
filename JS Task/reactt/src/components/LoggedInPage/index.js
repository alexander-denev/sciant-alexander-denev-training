import React, { useEffect, useState } from 'react';
import LoginTitle from './LoginTitle';
import Tickers from './Tickers';
import './style.css';

export default function LoggedInPage({ accessToken, setAccessToken }) {
  const [userData, setUserData] = useState();

  useEffect(() => {
    (async () => {
      const getResponse = await fetch(process.env.REACT_APP_RESTAPI_HOST + '/user', {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      });

      if (getResponse.status !== 200) {
        setAccessToken(null);
        return;
      }

      const getResponseBody = await getResponse.json();
      const userData = getResponseBody.userData;
      setUserData(userData);
    })();
  }, [accessToken, setAccessToken]);

  if (userData) {
    return (
      <div className='wrapDiv'>
        <div className='titleDiv'>
          <LoginTitle userName={userData.name} />

          <button
            onClick={() => {
              setAccessToken(null);
            }}
            className='logoutButton'
          >
            Log Out
          </button>
        </div>

        <Tickers accessToken={accessToken} />
      </div>
    );
  } else {
    return <div>Loading user data...</div>;
  }
}
