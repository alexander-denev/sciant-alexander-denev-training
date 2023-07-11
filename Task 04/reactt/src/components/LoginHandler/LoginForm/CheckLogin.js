export default async function CheckLogin(email, password) {
  try {
    const response = await fetch('http://' + process.env.REACT_APP_RESTAPI_HOST + '/login_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        hash: password,
      }),
    });

    if (response.status === 200) {
      return { statusCode: 200, userObject: await response.json() };
    } else {
      return { statusCode: response.status };
    }
  } catch (error) {
    console.log(error);
  }
}
