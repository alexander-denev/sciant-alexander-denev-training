import React, { useRef } from 'react';
import './style.css';

export default function TickersTable({ changeTicker, children }) {
  const symbol = useRef();
  const name = useRef();
  const price = useRef();

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Symbol</th>
          <th>Name</th>
          <th>Price</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {children}
        <tr>
          <td></td>
          <td>
            <input type="text" ref={symbol}></input>
          </td>
          <td>
            <input type="text" ref={name}></input>
          </td>
          <td>
            <input type="number" ref={price}></input>
          </td>
          <td>
            <button
              onClick={() =>
                changeTicker.add({
                  symbol: symbol.current.value,
                  name: name.current.value,
                  price: price.current.value,
                })
              }
            >
              ➕
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
