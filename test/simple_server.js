/**
 * Copyright (C) 2016  Green Screens Ltd.
 *
 * WebSocket commands - EHLL API implementation
 */

const WebSocketServer = require('ws').Server;


/**
 * Send response with error handling
 */
function respond(message) {

    let ws = this;
    let data = message;

    if (typeof message !== 'string') {
        message.ts = Date.now();
        data = JSON.stringify(message);
    }

    ws.send(data, function ack(error) {
      // if error is not defined, the send has been completed,
      // otherwise the error object will indicate what failed.
      if (error) {
          console.log(error);
      }
    });

}

/**
 * Handle received message
 */
function onMessage(message) {

    let ws = this;
    let obj = null;
    let rid = null;

    try {
        obj = JSON.parse(message);
        obj.rid = obj.rid || -1;
        rid = obj.rid;
        ws.respond(obj);
    } catch (e) {
        ws.respond({success:false, msg : e.message, rid : rid});
    }

}

/**
 * Event when client connect
 */
function onConnection(ws) {
      ws.respond = respond.bind(ws);
      ws.on('message', onMessage.bind(ws));
}

/**
 * Start WebSocket service
 */
function onStart() {

 let port = 5250;

 console.log(`AEHLL API service starting at port : ${port}`);

 var wss = new WebSocketServer({ port: port});
 wss.on('connection', onConnection);

}

// detect application start and start WebSocket
onStart();
