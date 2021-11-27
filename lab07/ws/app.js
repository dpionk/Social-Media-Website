'use strict';
const express = require('express');
const http = require('http');
const socketio = require('socket.io')
const { userJoin, getCurrentUser, userLeaves} = require('./utils/users')


const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(express.static('public'));




const formatMessage = (login,message) => {
	return {
		login,
		message
	}
}


io.on('connection', socket => {

	socket.on('joinRoom', ({ login, room }) => {

	const user = userJoin(socket.id, login, room);
	socket.join(user.room)

	socket.emit('message', formatMessage('Bot', 'Witaj na chacie :)'))

	//pokazanie innym userom, że ktoś się zalogował
	socket.broadcast.to(user.room).emit('message', formatMessage('Bot', `${user.login} dołączył/a do chatu`));


	});

	
	socket.on('chatMessage', (message) => {
		const user = getCurrentUser(socket.id);
		io.emit('message', formatMessage(user[0].login, message))
	})

	socket.on('disconnect', () => {
		const user = userLeaves(socket.id);
		//pokazanie innym userom, że ktoś wyszedł
		if(user) {
		io.emit('message', formatMessage('Bot',`${user.login} rozłączył/a się z chatu`));
		}
	})

})


server.listen(3000, function () {
    console.log('Serwer HTTP działa na porcie 3000');
});
