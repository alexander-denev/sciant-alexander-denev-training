import React, { useRef } from 'react';
import SendLogin from './SendLogin';

export default function LoginForm({ username }) {

  const credentials = {
    username: useRef(),
    password: useRef()
  };
  

  if (!username) {
    return (
      <>
  
        <label htmlFor="usernameInput">
          Username 
          <input type="text" ref={credentials.username}></input><br/>
        </label>
  
        <label>
          Password 
          <input type="password" ref={credentials.password}></input><br/>
        </label>
  
        <button onClick={SendLogin({
          username: credentials.username.current.value,
          password: credentials.password.current.value
        })}>Login</button>
        
      </>
    )

  } else {
    return null;
  }
  
}
