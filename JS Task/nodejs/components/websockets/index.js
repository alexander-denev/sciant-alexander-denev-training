const WebSocket = require('ws');

const ws = new WebSocket('wss://www.bitmex.com/realtime?subscribe=instrument:XBTUSD,instrument:ETHUSD,instrument:LTCUSD');

// ws.on('open', function open() {
//   ws.send('ping');
// });

ws.on('message', function incoming(data) {
  console.log(data.toString());
  // console.log(JSON.parse(data.toString()));
});

ws.on('error', function error(err) {
  console.error('WebSocket encountered error: ', err);
});
