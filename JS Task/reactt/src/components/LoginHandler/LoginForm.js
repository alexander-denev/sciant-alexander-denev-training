import React, { useState } from 'react';

export default function LoginForm({ setAccessToken }) {
  const [loginError, setLoginError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const loginResponse = await fetch(process.env.REACT_APP_RESTAPI_HOST + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const loginSatusCode = loginResponse.status;

      if (loginSatusCode === 200) {
        // Server responded with OK
        const loginResponseBody = await loginResponse.json();
        const accessToken = loginResponseBody.accessToken;

        setAccessToken(accessToken);
      } else {
        // Server responded with an error code
        if (loginSatusCode === 500) {
          const parsedError = (await loginResponse.json()).error;
          setLoginError({ status: loginResponse.status, error: parsedError });
        } else {
          setLoginError({ status: loginResponse.status });
        }
      }
    } catch (error) {
      setLoginError({ error });
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

      {loginError ? (
        <>Error: {(loginError.status ? loginError.status : null) + (loginError.error ? ': ' + loginError.error : null)}</>
      ) : null}
    </form>
  );
}
