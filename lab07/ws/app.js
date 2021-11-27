'use strict';
const express = require('express');
const http = require('http');
const socketio = require('socket.io')


const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(express.static('public'));

io.on('connection', socket => {
	console.log('Ktoś się połączył')
})

// wss.on('connection', function connection(ws) {
//     ws.on('message', function incoming(data) {
//         wss.clients.forEach(function each(client) {
//             if (client != ws && client.readyState == WebSocket.OPEN) {
//                 client.send(data);
                
//             }
//         })
//     })
// })

//io.on('connection', client => {
//    client.on('connect', data => {
//        console.log("Someone just connected")
//    })
//    client.on('disconnect', () => {
//        console.log("Someone just disconnected")
//    })
//})

server.listen(3000, function () {
    console.log('Serwer HTTP działa na porcie 3000');
});
