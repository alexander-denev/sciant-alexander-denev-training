import React from 'react';

export default function TickersTable({ addButton, children }) {
  return (
    <div className="ticker_table">
      <div className="ticker_table_header">
        <div>Symbol</div>
        <div>Price</div>
        <div>
          <button style={{ visibility: 'hidden' }}>❌</button>
        </div>
      </div>

      {children}

      <div className='ticker_table_endRow'>
        {addButton}
      </div>
    </div>
  );
}
