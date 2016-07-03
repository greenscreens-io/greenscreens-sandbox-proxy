/**
 * Copyright (C) 2016  Green Screens Ltd.
 */

const events = global.events;
const remote = global.remote;

/**
 * Handle data to forwarder or commander
 * Handle list of connected clients
 * @type {Object}
 */
var Handler = {

    /**
     * Event to receive message from WebSocket service
     * @param  {Object} ws   WebSocket connection instance
     * @param  {Object} obj  Data received from WebSocket
     */
    onWsIncomming : function(ws, obj) {
        events.emit('command', ws, obj);
    },

    /**
     * When remote Websocket is disconnected
     * @param  {[type]} id BrowserWindow id
     */
    onDisconnect : function (ws) {
        if (ws.isTerminal) {
            delete remote.terminal[ws.id];
        } else {
            delete remote.client[ws.id];
        }
    },

    /**
     * When remote WebSocket is connected
     * @param  {[type]} id BrowserWindow id
     */
    onConnect : function (ws) {
       if (ws.isTerminal) {
         remote.terminal[ws.id] = ws;
       } else {
         remote.client[ws.id] = ws;
       }
    }

};

//Event to receive message from WebSocket service
events.on('ws-incomming', Handler.onWsIncomming);

// When rederer remote Websocket is disconnected
events.on('ws-disconnected', Handler.onDisconnect);

// When rederer remote Websocket is connected
events.on('ws-connected', Handler.onConnect);
