import React, { useState } from 'react';
import CheckLogin from './CheckLogin';

export default function LoginForm({ setUserObject }) {
  const [loginError, setLoginError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loginResponse = await CheckLogin(email, password);
    if (loginResponse.statusCode === 200) {
      setUserObject(loginResponse.userObject);
    } else {
      setLoginError(loginResponse.statusCode);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input type="text" value={email} onChange={(event) => setEmail(event.target.value)}></input>
      </label>
      <br />

      <label>
        Password
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)}></input>
      </label>
      <br />

      <input type="submit" value="Login" />
      <br />

      {loginError ? <>Error: {loginError}</> : null}
    </form>
  );
}
