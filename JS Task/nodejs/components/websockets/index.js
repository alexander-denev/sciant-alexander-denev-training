const WebSocket = require('ws');

const websocket = new WebSocket('wss://www.bitmex.com/realtime?subscribe=instrument:XBTUSD,instrument:ETHUSD,instrument:LTCUSD');

websocket.on('open', function open() {
  console.log('Connected');
});

websocket.on('message', function incoming(data) {
  const parsedData = JSON.parse(data.toString());
  console.log(parsedData);
});

websocket.on('error', function error(err) {
  console.error('WebSocket encountered error: ', err);
});
