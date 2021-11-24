'use strict';
const connect = require("connect");
const app = connect();
const serveStatic = require('serve-static');
const server = require("http").createServer(app);
const WebSocket = require("ws")
const wss = new WebSocket.Server({ server })
app.use(serveStatic("public"));

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        wss.clients.forEach(function each(client) {
            if (client != ws && client.readyState == WebSocket.OPEN) {
                client.send(data);
                
            }
        })
    })
})
server.listen(3000, function () {
    console.log('Serwer HTTP działa na porcie 3000');
});
