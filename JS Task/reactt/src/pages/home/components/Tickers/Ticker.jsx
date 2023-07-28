import React, { useEffect, useRef, useState } from 'react';

export default function Ticker({ row, button }) {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(false);
  }, [row]);

  const newSymbol = useRef();
  const newPrice = useRef();

  return (
    <div className='ticker_table_row'>

      <div className='symbol'>{isEditing ? <input defaultValue={row.symbol} ref={newSymbol} type="text"></input> : row.symbol}</div>

      <div className='symbol'>{isEditing ? <input defaultValue={row.price} ref={newPrice} type="number"></input> : '$' + row.price}</div>

      <div>{button}</div>
    </div>
  );
}
