import React, { useEffect, useState } from 'react';

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
      const loginResponse = await fetch(process.env.REACT_APP_RESTAPI_HOST + '/login', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

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

      {invalidCredentials ? <div>Invalid Credentials!</div> : null}
    </form>
  );
}
