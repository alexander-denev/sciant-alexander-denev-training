import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Ticker from './Ticker';
import TickerTable from './TickersTable';
import Fetches from './fetches';

import { io } from 'socket.io-client';

export default function Tickers({ accessToken }) {
  const myFetch = useMemo(() => {
    return new Fetches();
  }, []);
  const [data, setData] = useState();
  const [linking, setLinking] = useState(() => false);

  const getData = useCallback(async () => {
    const result = await myFetch.GET_userTicker({ Authorization: 'Bearer ' + accessToken });
    if (result) {
      setData(result);
    }
  }, [accessToken, myFetch]);

  const getUnlinkedTickers = useCallback(async () => {
    const resultTicker = await myFetch.GET_ticker({ Authorization: 'Bearer ' + accessToken });
    const resultUserTicker = await myFetch.GET_userTicker({ Authorization: 'Bearer ' + accessToken });

    if (!resultTicker || !resultUserTicker) return;

    const finalResult = resultTicker.filter((ticker) => {
      return !resultUserTicker.some((userTicker) => ticker.id === userTicker.id);
    });

    setData(finalResult);
  }, [accessToken, myFetch]);

  useEffect(() => {
    if (!linking) {
      var socket;
      async function updateData() {
        // Fetch everything at first
        getData();

        // Then setup a websocket for updating
        socket = io(process.env.REACT_APP_RESTAPI_HOST, { extraHeaders: { Authorization: 'Bearer ' + accessToken } });
        socket.on('data', (data) => {
          setData((current) => {
            return current.map((obj) => (obj.id === data.id ? data : obj));
          });
        });
      }
      updateData();
    } else {
      getUnlinkedTickers();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [accessToken, getData, linking, getUnlinkedTickers]);

  useEffect(() => {
    setData([]);
  }, [linking]);

  async function link(tickerId) {
    const result = await myFetch.POST_userTicker(tickerId, { Authorization: 'Bearer ' + accessToken });
    if (result) {
      getUnlinkedTickers();
    }
  }

  async function unlink(tickerId) {
    const result = await myFetch.DELETE_userTicker(tickerId, { Authorization: 'Bearer ' + accessToken });
    if (result) {
      getData();
    }
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <TickerTable
      addButton={
        <button
          onClick={() => {
            setLinking((current) => !current);
          }}
        >
          {linking ? '⬅' : '➕'}
        </button>
      }
    >
      {data.map((row) => {
        return (
          <Ticker
            row={row}
            button={
              linking ? (
                <button
                  onClick={() => {
                    setData((current) => {
                      return current.filter((currentRow) => currentRow.id !== row.id);
                    });
                    link(row.id);
                  }}
                >
                  ➕
                </button>
              ) : (
                <button
                  onClick={() => {
                    setData((current) => {
                      return current.filter((currentRow) => currentRow.id !== row.id);
                    });
                    unlink(row.id);
                  }}
                >
                  ❌
                </button>
              )
            }
            key={'ticker_' + row.id}
          />
        );
      })}
    </TickerTable>
  );
}
