import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Ticker from './Ticker';
import TickerTable from './TickersTable';
import Fetches from './fetches';

export default function Tickers({ accessToken }) {
  const myFetch = useMemo(() => {
    return new Fetches();
  }, []);
  const [tickerData, setTickerData] = useState();

  const updateTickerData = useCallback(async () => {
    const result = await myFetch.GET_userTicker({ Authorization: 'Bearer ' + accessToken });
    if (result) {
      setTickerData(result);
    }
  }, [accessToken, myFetch]);

  useEffect(() => {
    updateTickerData();

    return () => {
      if (myFetch.currentFetch) {
        myFetch.currentFetch.abort();
      }
    };
  }, [updateTickerData, myFetch]);

  class tickerActions {
    async link(tickerId) {
      setTickerData((current) => {
        let tempTickerData = { ...tickerData };
        tempTickerData.id = uuid();
        return [...current, tempTickerData];
      });

      const result = await myFetch.POST_userTicker(tickerId, { Authorization: 'Bearer ' + accessToken });
      if (result) {
        updateTickerData();
      }
    }

    async unlink(tickerId) {
      setTickerData((current) => {
        return current.filter((row) => row.id !== tickerId);
      });

      const result = await myFetch.DELETE_userTicker(tickerId, { Authorization: 'Bearer ' + accessToken });
      if (result) {
        updateTickerData();
      }
    }
  }

  if (tickerData) {
    return (
      <TickerTable tickerActions={tickerActions} updateTickerData={updateTickerData}>
        {tickerData.map((row) => {
          return <Ticker row={row} tickerActions={tickerActions} key={'ticker_' + row.id} />;
        })}
      </TickerTable>
    );
  } else {
    return <div>Loading ticker data...</div>;
  }
}
