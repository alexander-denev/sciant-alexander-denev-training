import React, { useEffect, useRef, useState } from 'react';

export default function Ticker({ row, tickerActions }) {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(false);
  }, [row]);

  const newSymbol = useRef();
  const newName = useRef();
  const newPrice = useRef();

  return (
    <tr>
      <td>
        <button onClick={() => tickerActions.delete(row.id)}>❌</button>
      </td>

      <td>{isEditing ? <input defaultValue={row.symbol} ref={newSymbol} type="text"></input> : row.symbol}</td>

      <td>{isEditing ? <input defaultValue={row.name} ref={newName} type="text"></input> : row.name}</td>

      <td>{isEditing ? <input defaultValue={row.price} ref={newPrice} type="number"></input> : '$' + row.price}</td>

      <td>
        {isEditing ? (
          <button
            onClick={() => {
              setIsEditing(false);
              if (
                row.symbol !== newSymbol.current.value ||
                row.name !== newName.current.value ||
                row.price !== Number(newPrice.current.value)
              ) {
                tickerActions.update({
                  id: row.id,
                  symbol: newSymbol.current.value,
                  name: newName.current.value,
                  price: newPrice.current.value,
                });
              }
            }}
          >
            ✅
          </button>
        ) : (
          <button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            ✍
          </button>
        )}
      </td>
    </tr>
  );
}
