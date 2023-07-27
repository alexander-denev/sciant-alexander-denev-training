import React, { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
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

  const tickerActions = {
    add: async (tickerData) => {
      try {
        setTickerData((current) => {
          let tempTickerData = {...tickerData};
          tempTickerData.id = uuid();
          return [...current, tempTickerData];
        });

        await fetch(process.env.REACT_APP_RESTAPI_HOST + '/ticker', {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
          body: JSON.stringify(tickerData),
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

    update: async (tickerData) => {
      const { id, ...putData } = tickerData;

      try {
        setTickerData((current) => {
          return current.map((obj) => (obj.id === id ? { ...putData, id: obj.id } : obj));
        });

        await fetch(process.env.REACT_APP_RESTAPI_HOST + '/ticker/' + id, {
          method: 'PUT',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
          body: JSON.stringify({ ...putData, price: Number(putData.price) }),
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
      <TickerTable tickerActions={tickerActions} fetchTickerData={fetchTickerData}>
        {tickerData.map((row) => {
          return <Ticker row={row} tickerActions={tickerActions} key={'ticker_' + row.id} />;
        })}
      </TickerTable>
    );
  } else {
    return <div>Loading ticker data...</div>;
  }
}
