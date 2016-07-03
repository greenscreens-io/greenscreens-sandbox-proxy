/**
 * Copyright (C) 2016  Green Screens Ltd.
 */

const Cache = require('mem-cache');

const events = global.events;
const remote = global.remote;

var cache = new Cache();

/**
 * Forwards calls to remote client or remote web terminal
 * @type {Object}
 */
var Forwarder = {

    /**
     * Forward from local client to web terminal
     * @param  {Object} ws   WebSocket connection instance
     * @param  {Object} obj  Data received from WebSocket
     */
    forwardFromClient : function(ws, obj) {

       let client = ws;
       let terminal = null;

       if (obj.winID) {
          terminal = remote.terminal[obj.winID];
       }

       if (terminal === null) {
         client.respond({success: false, rid : obj.rid, msg : 'Command or terminal found!' });
       } else {
         cache.set(obj.rid, ws, 30000);
         terminal.respond(obj);
       }

    },

    /**
     * Forward from web terminal to local client
     * @param  {Object} ws   WebSocket connection instance
     * @param  {Object} obj  Data received from WebSocket
     */
    forwardFromTerminal : function(ws, obj) {

      let client = null;
      let terminal = ws;

      if (obj.rid) {
          client = cache.get(obj.rid);
          cache.get(obj.rid);
      }

      if (client === null) {
          terminal.respond({success: false, rid : obj.rid, msg : 'Command or remote client not found!' });
      } else {
          client.respond(obj);
      }

    },

    /**
     * Forward between client and terminal, determine direction
     * @param  {Object} ws   WebSocket connection instance
     * @param  {Object} obj  Data received from WebSocket
     */
    forward : function(ws, obj) {

       if (ws.isTerminal) {
         Forwarder.forwardFromTerminal(ws, obj);
       } else {
         Forwarder.forwardFromClient(ws, obj);
       }
    }

};

// When request to frward data to the other side
events.on('forward', Forwarder.forward);
