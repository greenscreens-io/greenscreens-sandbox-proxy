/**
 * Copyright (C) 2015, 2016  GreenScreens Ltd.
 *
 * A-HLL Windows Service Installation 
 *
 * NOTE: When running as a service, GUI apps will run
 * started with STRRMTCMD will start under session:0
 * and will not be visible on dektop.
 *
 */

var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Green Screens A-HLL',
  description: 'A-HLL service to enable web browser Terminal integration.',
  script: require('path').join(__dirname, 'service.js')
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();