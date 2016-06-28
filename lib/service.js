/**
 * Copyright (C) 2015, 2016  GreenScreens Ltd.
 *
 * Main WebSocket proxy service
 */

const WebSocketServer = require('ws').Server;
const Http = require('http');
const Https = require('https');
const URL = require('url');
const FS = require('fs');
const Path = require('path');


const PortUnsec = 5250;
const PortSec = 5251;

const FILTER = ['chrome-extension:', 'app.greenscreens.io', '127.0.0.1', 'localhost'];
const CLIENTS = ['ahll', 'terminal'];
const DEBUG_APP = 'omalebghpgejjiaoknljcfmglgbpocdp';
const events = global.events;

//
// SSL Certificates
//
const keyPath = Path.join(__dirname, '../', 'certs', 'server_key.pem');
const certPath = Path.join(__dirname, '../', 'certs', 'server_cert.pem');

const SslOptions = {
  key: FS.readFileSync(keyPath),
  cert: FS.readFileSync(certPath),
  requestCert: false,
  rejectUnauthorized: true
};

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
 * Handle client closed / error
 */
function onClose(message) {
    let ws = this;
    events.emit('ws-disconnected', ws);
}

/**
 * Handle received message
 */
function onMessage(message) {

    let ws = this;
    let obj = null;
    let rid = -1 * Date.now();

    try {
        obj = JSON.parse(message);
        obj.rid = obj.rid || rid;
        rid = obj.rid;
        events.emit('ws-incomming', ws, obj);
    } catch (e) {
        ws.respond({success:false, msg : e.message, rid : rid});
        console.log(e);
    }

}

/**
 * Send data to all connected clients
 * @param  {[type]} data [description]
 */
 function broadcast(data) {
   let wss = this;
   wss.clients.forEach(function each(client) {
       if (typeof client.respond === 'function') {
           client.respond(data);
       }
   });
 }

 /**
  * Check client access
  */
  function isClientAllowed(ws) {

    let headers = ws.upgradeReq.headers;
    let protocol = headers['sec-websocket-protocol'];
    let params = URL.parse(ws.upgradeReq.url, true);
    let query = params.query;

    // allow debug mode
    if (headers.origin && (headers.origin.indexOf(DEBUG_APP)>0 || headers.origin === 'null' )) {
      ws.isTerminal = false;
      return true;
    }

    let isValid =  typeof protocol === 'string' && CLIENTS.indexOf(protocol) > -1;

    if (isValid && typeof headers.origin === 'string') {
       // get client location
       let remoteaddr = headers['x-forwarded-for'] || ws.upgradeReq.connection.remoteAddress;
       let location = URL.parse(headers.origin, true);
       isValid = FILTER.indexOf(location.protocol) > -1 || FILTER.indexOf(location.hostname) > -1 || FILTER[remoteaddr] > -1;
    }

    // TODO password for client access
    // protocol === 'ahll' && query.ahllPwd === ...

    return isValid;
  }

 /**
  * Event when client connect
  */
 function onConnection(ws) {

   var valid = isClientAllowed(ws);
   //valid = true;

   // check if client allowed to access
   if (!valid) {
     console.log('Client not allowed access :');
     console.log(ws.upgradeReq.headers);
     ws.send(JSON.stringify({success:false, meessage: 'Access not allowed'}));
     ws.close();
   } else {
      ws.id = Date.now();
      if (typeof ws.isTerminal === 'undefined') {
        ws.isTerminal = ws.upgradeReq.headers['sec-websocket-protocol'] === 'terminal';
      }
      ws.respond = respond.bind(ws);
      ws.on('message', onMessage.bind(ws));
      ws.on('close', onClose.bind(ws));
      ws.on('error', onClose.bind(ws));
      events.emit('ws-connected', ws);
   }

}

/**
 * Set headers in response
 */
function onHeaders(headers) {
    headers.ahll = "proxy";
    //console.log("HEADERS >> ", headers);
}

/**
 * Create WebSocket server
 */
function createServer(svc, port, options) {

    let server = svc.createServer(options);
    server.listen(port, function(){
        //Callback triggered when server is successfully listening. Hurray!
        console.log("Server listening on: localhost:%s", port);
    });


    let wss = new WebSocketServer({server: server});
    wss.broadcast = broadcast.bind(wss);

    wss.on('connection', onConnection);
    wss.on('headers', onHeaders);
    events.on('ws-broadcast', wss.broadcast);
}

/**
 * Start WebSocket service
 */
function onStart() {

 console.log(`Starting at NON-SSL port : ${PortUnsec}`);
 createServer(Http, PortUnsec, null);

 console.log(`Starting at SSL port : ${PortSec} `);
 createServer(Https, PortSec, SslOptions);

}

// start WebSocket services
console.log('GreenScreens SandBox Proxy Service');
onStart();
