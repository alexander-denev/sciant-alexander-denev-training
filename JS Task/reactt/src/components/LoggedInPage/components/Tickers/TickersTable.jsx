import React from 'react';

export default function TickersTable({ updateTickerData, children }) {
  return (
    <table>
      <thead>
        <tr>
          <th>
            <button style={{ visibility: 'hidden' }}>❌</button>
          </th>
          <th>Symbol</th>
          <th>Price</th>
          <th>
            <button onClick={updateTickerData}>🔁</button>
          </th>
        </tr>
      </thead>
      <tbody>
        {children}
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <button
              onClick={() => {
                console.log('You thought');
              }}
            >
              ➕
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
