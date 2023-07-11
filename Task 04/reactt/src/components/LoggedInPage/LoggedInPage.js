import React from 'react';
import LoginTitle from './subcomponents/LoginTitle';

export default function LoggedInPage({ userData }) {
  return (
    <>
      <LoginTitle userName={userData.name} />
      <h2>You've successfully logged in!</h2>
    </>
  );
}
