/**
 * Copyright (C) 2015, 2016  GreenScreens Ltd.
 *
 * WebSocket commands - EHLL API implementation
 */

var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:5250', {
  headers : {
          'ahll' : 'client'  // terminal
  }
});

ws.on('open', function open() {
  let msg = {cmd:'echo', rid : Date.now()};
  ws.send(JSON.stringify(msg));
});

ws.on('message', function(data, flags) {
  // flags.binary will be set if a binary data is received.
  // flags.masked will be set if the data was masked.
  console.log(data);
});