export default async function Main(email, password) {
  const response = await fetch(process.env.REACT_APP_RESTAPI_HOST + '/login', {
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
  return response;
}
