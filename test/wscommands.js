/**
 * Copyright (C) 2015, 2016  GreenScreens Ltd.
 *
 * WebSocket commands - EHLL API implementation
 */

const events = global.events;

/**
 * Modern EHLL API implementation
 * Object containing methods available from remote caller
 * @type {Object}
 */
var Commander = {

    /**
     * Response to caller with same data
     * @param  {Object} ws   WebSocket connection instance
     * @param  {Object} obj  Data received from WebSocket
     */
    echo : function(ws, obj) {
        ws.respond(obj);
        if (obj.all === true) {
            events.emit('ws-broadcast', obj);
        }
    },

    /**
     * Event to receive message from WebSocket service
     * @param  {Object} ws   WebSocket connection instance
     * @param  {Object} obj  Data received from WebSocket
     */
    onWsIncomming : function(ws, obj) {

        if (typeof obj === 'object' && typeof obj.cmd === 'string') {
            if ( obj.cmd && typeof Commander[obj.cmd] === 'function') {
                Commander[obj.cmd](ws, obj);
            } else {
                ws.respond({success: false, rid : obj.rid, msg : 'Command not found!' });
            }
        }
    },

    /**
     * When remote Websocket is disconnected
     * @param  {[type]} id BrowserWindow id
     */
    onDisconnect : function (id) {
        let data = {
            winID : id
        };
        events.emit('ws-broadcast', {evt:"onDisconnect", data : data});
    },

    /**
     * When remote Websocket is connected
     * @param  {[type]} id BrowserWindow id
     */
    onConnect : function (id) {
        let data = {
            winID : id
        };
        events.emit('ws-broadcast', {evt:"onConnect", data : data});
    }

};

//Event to receive message from WebSocket service
events.on('ws-incomming', Commander.onWsIncomming);
// When rederer remote Websocket is disconnected
events.on('ws-disconnected', Commander.onDisconnect);

// When rederer remote Websocket is connected
events.on('ws-connected', Commander.onConnect);
