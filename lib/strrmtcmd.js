/**
 * Copyright (C) 2016  Green Screens Ltd.
 *
 * Support for STRRMTCMD
 */

const events = global.events;
const Exec = require('child_process').exec;
const Spawn = require('child_process').spawn;

/**
 * Start external process
 * @param  {Object} ws  WebSocket
 * @param  {String} cmd Remote command to execute
 */
function onRemoteCommandAsync(ws, cmd) {

    const child = Spawn(cmd, [], {
          detached: true,
          stdio: ['ignore']
    });
    child.unref();
}

/**
 * Start external process
 * @param  {Object} ws  WebSocket
 * @param  {String} cmd Remote command to execute
 */
function onRemoteCommandSync(ws, cmd) {

    var child = Exec(cmd, function( error, stdout, stderr) {

           if ( error !== null ) {
                console.log(stderr);
                // error handling & exit
           }

           // normal

       });
}

// event from terminal RMTCMD
events.on('rmtcmd', onRemoteCommandAsync);
