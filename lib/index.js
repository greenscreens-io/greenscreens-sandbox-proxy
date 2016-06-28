/**
 * Copyright (C) 2015, 2016  GreenScreens Ltd.
 *
 * Main lib loader. Last loaded must be service
 */

const Events = require('events');

global.events = new Events.EventEmitter();

global.remote = {
  client : {},
  terminal : {}
};

// load websocket event handling libs
require('./handler');
require('./forwarder');
require('./commander');
require('./service');
require('./strrmtcmd');
