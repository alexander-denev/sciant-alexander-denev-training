import React from 'react'

export default function PageTitle({ username }) {

  if (username) {

    return (
      <h1>Hello, {username}</h1>
    );

  } else {
    return null;
  }
}
