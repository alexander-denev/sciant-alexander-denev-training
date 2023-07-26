import React, { useEffect, useState } from 'react';
import fetchLogin from './fetchLogin'

export default function LoginForm({ setAccessToken }) {
  const [invalidCredentials, setInvalidCredentials] = useState(() => false);

  const [email, setEmail] = useState(() => '');
  const [password, setPassword] = useState(() => '');

  useEffect(() => {
    setInvalidCredentials(false);
  }, [email, password]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const loginResponse = await fetchLogin(email, password);

      const loginSatusCode = loginResponse.status;

      if (loginSatusCode === 200) {
        const loginResponseBody = await loginResponse.json();
        const accessToken = loginResponseBody.accessToken;

        setAccessToken(accessToken);
      } else if (loginSatusCode === 401) {
        setInvalidCredentials(true);
      } else {
        const parsedError = (await loginResponse.json()).error;
        console.log({ statusCode: loginResponse.status, error: parsedError });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="wrapDiv">
        <form className="loginForm" onSubmit={handleSubmit}>
          <h1 className="loginTitle">Login</h1>
          <label>Email</label>
          <input type="text" value={email} onChange={(event) => setEmail(event.target.value)}></input>

          <label>Password</label>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)}></input>

          <input className="submit" type="submit" value="Login" />

          {invalidCredentials ? <div>Invalid Credentials!</div> : null}
        </form>
      </div>
    </>
  );
}
