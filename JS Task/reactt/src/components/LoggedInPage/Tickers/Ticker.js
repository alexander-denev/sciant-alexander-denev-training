import React from 'react';

export default function Ticker({ row, changeTicker }) {
  return (
    <tr>
      <td>
        <button onClick={() => changeTicker.delete(row.id)}>❌</button>
      </td>
      <td>{row.symbol}</td>
      <td>{row.name}</td>
      <td>${row.price}</td>
      <td>
        <button onClick={() => changeTicker.update(row.id)}>✍</button>
      </td>
    </tr>
  );
}
