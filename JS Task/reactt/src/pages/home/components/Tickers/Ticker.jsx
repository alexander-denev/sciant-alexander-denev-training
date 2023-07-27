import React, { useEffect, useRef, useState } from 'react';

export default function Ticker({ row, deleteButton, addButton }) {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(false);
  }, [row]);

  const newSymbol = useRef();
  const newPrice = useRef();

  return (
    <tr>
      <td>{deleteButton}</td>

      <td>{isEditing ? <input defaultValue={row.symbol} ref={newSymbol} type="text"></input> : row.symbol}</td>

      <td>{isEditing ? <input defaultValue={row.price} ref={newPrice} type="number"></input> : '$' + row.price}</td>

      <td>{addButton}</td>
    </tr>
  );
}
