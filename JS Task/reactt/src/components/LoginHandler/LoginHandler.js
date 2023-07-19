import React, { useState } from 'react';

import LoggedInPage from '../LoggedInPage/LoggedInPage';
import LoginForm from './LoginForm/LoginForm';

export default function LoginHandler() {
  const sessionStorageUserObject = JSON.parse(sessionStorage.getItem('userObject'));
  const [userObject, setUserObject] = useState(sessionStorageUserObject);
  sessionStorage.setItem('userObject', JSON.stringify(userObject));

  if (userObject) {
    return (
      <>
        <LoggedInPage userData={userObject.userData} />
        <button onClick={() => setUserObject(null)}>Log Out</button>
      </>
    );
  } else {
    return <LoginForm setUserObject={setUserObject} />;
  }
}
