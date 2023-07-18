import React, { useCallback, useEffect, useRef, useState } from 'react';
import Ticker from './Ticker';
import TickerTable from './TickersTable';

export default function Tickers({ accessToken }) {
  const [tickerData, setTickerData] = useState();
  const currentFetch = useRef();

  const fetchTickerData = useCallback(async () => {
    if (currentFetch.current) {
      currentFetch.current.abort();
    }

    const abortController = new AbortController();
    currentFetch.current = abortController;

    try {
      const getResponse = await fetch(process.env.REACT_APP_RESTAPI_HOST + '/ticker', {
        signal: abortController.signal,
        method: 'GET',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      });
      const result = (await getResponse.json()).result;
      setTickerData(result);
    } catch (error) {
      console.log(error);
    } finally {
      currentFetch.current = null;
    }
  }, [accessToken]);

  useEffect(() => {
    fetchTickerData();

    return () => {
      if (currentFetch.current) {
        currentFetch.current.abort();
      }
    };
  }, [fetchTickerData]);

  const changeTicker = {
    add: async (tickerData) => {
      try {
        setTickerData((current) => {
          return [...current, (tickerData = { ...tickerData, id: current[current.length - 1].id + 1 })];
        });

        await fetch(process.env.REACT_APP_RESTAPI_HOST + '/ticker', {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
          body: JSON.stringify({ ...tickerData, price: Number(tickerData.price) }),
        });
      } catch (error) {
        console.log(error);
      } finally {
        fetchTickerData();
      }
    },
    delete: async (tickerId) => {
      try {
        setTickerData((current) => {
          return current.filter((row) => row.id !== tickerId);
        });

        await fetch(process.env.REACT_APP_RESTAPI_HOST + '/ticker/' + tickerId, {
          method: 'DELETE',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        fetchTickerData();
      }
    },
  };

  if (tickerData) {
    return (
      <TickerTable changeTicker={changeTicker}>
        {tickerData.map((row) => {
          return <Ticker row={row} changeTicker={changeTicker} key={'ticker_' + row.id} />;
        })}
      </TickerTable>
    );
  } else {
    return <div>Loading ticker data...</div>;
  }
}
