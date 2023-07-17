import React from 'react';
import LoginTitle from './LoginTitle';
// import Tickers from './Tickers';

export default async function LoggedInPage({ accessToken }) {

  const getResponse = await fetch(process.env.REACT_APP_RESTAPI_HOST + '/user', {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    },
  });

  const getResponseBody = await getResponse.json();
  const userData = getResponseBody.userData;

  
  return (
    <>
      <LoginTitle userName={userData.name} />

      {/* <Tickers accessToken={accessToken}/> */}
      
      <h3>You've successfully logged in!</h3>
    </>
  );
}
