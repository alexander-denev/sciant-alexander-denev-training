import React from 'react';

export default function TickersTable({ addButton, children }) {
  return (
    <table>
      <thead>
        <tr>
          <th>
            <button style={{ visibility: 'hidden' }}>❌</button>
          </th>
          <th>Symbol</th>
          <th>Price</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {children}
        <tr>
          <td/>
          <td/>
          <td/>
          <td>{addButton}</td>
        </tr>
      </tbody>
    </table>
  );
}
