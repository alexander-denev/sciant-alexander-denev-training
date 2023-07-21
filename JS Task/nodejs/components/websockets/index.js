const WebSocket = require('ws');
const socketIo = require('socket.io');

module.exports = (server, myJwt, pool) => {
  // WebSocket

  WebSocket;

  const ws = new WebSocket('wss://www.bitmex.com/realtime?subscribe=instrument:XBTUSD,instrument:ETHUSD,instrument:LTCUSD');

  ws.on('open', () => {
    console.log('WebSocket: Connected to Bitmex');
  });

  ws.on('error', (err) => {
    console.error('WebSocket: Encountered error: ', err);
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
  io.on('connection', (socket) => {
    const userId = socket.userObject ? socket.userObject.userId : '<no id>';

    console.log(`Socket.io: User ${userId} has connected`);
    socket.emit('connection', `Hello, user <${socket.id}>`);

    ws.on('message', async (unparsedData) => {
      // Data
      const data = JSON.parse(unparsedData.toString()).data[0];
      if (typeof data.symbol === 'undefined' || typeof data.markPrice === 'undefined') return;

      // Get all ticker symbols associated with the user
      const userTickerRows = (
        await pool.query('SELECT id, symbol FROM tickers WHERE id IN (SELECT ticker_id FROM user_tickers WHERE user_id = $1)', [
          userId,
        ])
      ).rows;

      // Compare if recieved symbol is wanted by the user
      let response;
      for (let row of userTickerRows) {
        if (row.symbol === data.symbol) {
          response = { id: row.id, symbol: data.symbol, price: data.markPrice };
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
