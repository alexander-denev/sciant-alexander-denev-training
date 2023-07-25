const WebSocket = require('ws');
const socketIo = require('socket.io');

module.exports = (server, myJwt, pool) => {
  // WebSocket
  const ws = new WebSocket('wss://www.bitmex.com/realtime?subscribe=instrument:XBTUSD,instrument:ETHUSD,instrument:LTCUSD');

  ws.on('open', () => {
    console.log('WebSocket: Connected to Bitmex');
  });

  ws.on('error', (err) => {
    console.error('WebSocket: Encountered error: ', err);
  });

  ws.on('message', async (unparsedData) => {
    // Data parse
    let data;
    try {
      data = JSON.parse(unparsedData.toString()).data[0];
    } catch {
      return;
    }
    if (typeof data.symbol === 'undefined' || typeof data.markPrice === 'undefined') return;

    // Store data on the database
    try {
      await pool.query(
        `
        DO
        $do$

        DECLARE
          getTickerId INTEGER;

        BEGIN
          getTickerId := (
            SELECT id 
            FROM tickers 
            WHERE symbol = $1
          );
    
          IF getTickerId IS NULL THEN
            INSERT INTO tickers
            (symbol)
            VALUES ($1)
            RETURNING id INTO getTickerId;
          END IF;
    
          INSERT INTO ticker_data
          (ticker_id, at, price)
          VALUES (
            getTickerId,
            $2,
            $3
          );
        END
        $do$
      `,
        [
          data.symbol,
          Math.floor(Date.now() / 1000), // convert current timestamp to seconds
          data.markPrice,
        ]
      );
    } catch (err) {
      console.log(err.stack);
    }
  });

  // Socket io
  const io = socketIo(server);

  // Authentication
  io.use((socket, next) => {
    const accessToken = socket.handshake.headers.authorization.split(' ')[1];
    if (!accessToken) {
      return next(new Error('No access token'));
    }

    const myJwtResult = myJwt.verifyToken(accessToken);
    if (!myJwtResult) {
      return next(new Error('Invalid token'));
    }
    socket.userObject = myJwtResult;

    next();
  });

  // Connection stuff
  io.on('connection', async (socket) => {
    const userId = socket.userObject ? socket.userObject.userId : '<no id>';

    console.log(`Socket.io: User ${userId} has connected`);
    socket.emit('connection', `Hello, user <${socket.id}>`);

    // Get all tickers linked to the user
    socket.userObject.userTickers = (
      await pool.query(
        `
        SELECT t.id, t.symbol
        FROM tickers t
        INNER JOIN user_tickers ut ON t.id = ut.ticker_id
        WHERE ut.user_id = $1
      `,
        [userId]
      )
    ).rows;

    ws.on('message', async (unparsedData) => {
      // Data parse
      const data = JSON.parse(unparsedData.toString()).data[0];
      if (typeof data.symbol === 'undefined' || typeof data.markPrice === 'undefined') return;

      // Compare if recieved symbol is wanted by the user
      let response;
      for (let ticker of socket.userObject.userTickers) {
        if (ticker.symbol === data.symbol) {
          response = { id: ticker.id, symbol: data.symbol, price: data.markPrice };
        }
      }
      if (!response) return;

      // Emit data
      socket.emit('data', response);
    });

    socket.on('disconnect', () => {
      console.log(`Socket.io: User ${userId} has disconnected`);
    });
  });
};
