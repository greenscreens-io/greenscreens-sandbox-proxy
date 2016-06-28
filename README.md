###GreenScreens SandBox Proxy Service

GreenScreens SandBox Proxy Service is Node.JS based WebSocket Proxy that runs as a Windows Service and enables communication between web application and native OS applications.

Main purpose is to enable integration with our A-HLL API for automated programmable terminal screen management.

* Clone repository
* Position to repository directory
* Install required modules

    npm install

* Register service to Windows (administrative privileges required)
    
    node install.js

* Start GreenScreens Web Terminal and open browser debug console
* Use sample code shown below to connect and issue command


To access WebSocket service, protocol service 'ahll' must be defined. If access is protected with password, it has to be set as URL parameter.
Password is enabled for additional security to protect client AHLL access only from sepcific clients and their locations.


Example without password

```
var ws = new WebSocket('ws://localhost:5250/','ahll');
```

Example with password

```
var ws = new WebSocket('ws://localhost:5250/?ahllPwd=MYPASS','ahll');
```


Simple test code

```
var ws = new WebSocket('ws://localhost:5250/', 'ahll');

ws.onmessage=function(e){
  console.log(e.data)
};

ws.onopen=function() {
   var msg = JSON.stringify({cmd:'echo'});
   ws.send(msg);
};

```

If you are using SSL on your web site, use the following code

```
var ws = new WebSocket('wss://localhost:5251/', 'ahll');

ws.onmessage=function(e){
  console.log(e.data)
};

ws.onopen=function() {
   var msg = JSON.stringify({cmd:'echo'});
   ws.send(msg);
};

```

