/**
 * Copyright (C) 2016  Green Screens Ltd.
 */

const events = global.events;
const remote = global.remote;

/**
 * Execute local commands, for example, list of active teriminals etc...
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
     * Send list of connected web terminals
     * @param  {Object} ws   WebSocket connection instance
     * @param  {Object} obj  Data received from WebSocket
     */
    queryInstances : function (ws, obj) {
        let keys = Object.keys(remote.terminal);
        ws.respond({success: true, rid : obj.rid, data : keys});
    },

    /**
     * Call local program from web terminal
     * @param  {Object} ws   WebSocket connection instance
     * @param  {Object} obj  Data received from WebSocket
     */
    rmtcmd : function(ws, obj) {
        events.emit('rmtcmd', ws, obj.data);
        ws.respond({success: true, rid : obj.rid});
    }

};

// When request to frward data to the other side
events.on('command', function(ws, obj){

  let isLocalCmd = typeof obj.cmd === 'string' && typeof Commander[obj.cmd] === 'function';

  if ( isLocalCmd ) {
    Commander[obj.cmd](ws, obj);
  } else {
    events.emit('forward', ws, obj);
    //ws.respond({success: false, rid : obj.rid, msg : 'Command not found!' });
  }

});
