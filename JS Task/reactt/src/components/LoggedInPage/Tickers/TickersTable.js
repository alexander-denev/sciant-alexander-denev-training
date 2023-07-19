import React, { useState } from 'react';
import './style.css';

export default function TickersTable({ tickerActions, fetchTickerData, children }) {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  return (
    <table>
      <thead>
        <tr>
          <th>
            <button style={{ visibility: 'hidden' }}>❌</button>
          </th>
          <th>Symbol</th>
          <th>Name</th>
          <th>Price</th>
          <th>
            <button onClick={fetchTickerData}>🔁</button>
          </th>
        </tr>
      </thead>
      <tbody>
        {children}
        <tr>
          <td></td>
          <td>
            <input type="text" value={symbol} onChange={(event) => setSymbol(event.target.value)}></input>
          </td>
          <td>
            <input type="text" value={name} onChange={(event) => setName(event.target.value)}></input>
          </td>
          <td>
            <input type="number" value={price} onChange={(event) => setPrice(event.target.value)}></input>
          </td>
          <td>
            <button
              onClick={() => {
                setSymbol('');
                setName('');
                setPrice('');
                tickerActions.add({
                  symbol: symbol,
                  name: name,
                  price: Number(price),
                });
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
