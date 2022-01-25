const express = require('express');
const app = express();
const http = require('http');

const mqtt = require('mqtt');

const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: 'http://localhost:3000',
	}
});

const client = require('./config/psqlClient');
const users = require('./routes/users');
const posts = require('./routes/posts');
const comments = require('./routes/comments');




app.use(express.json());
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

app.use('/users', users);
app.use('/posts', posts);
app.use('/comments', comments);

let activeUsers = []


client
	.connect()
	.then(() => {
		console.log('Connected to PostgreSQL');

		client.query(`CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
	role VARCHAR NOT NULL,
	username VARCHAR(60) NOT NULL,
	userpassword VARCHAR(60) NOT NULL,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
	picture VARCHAR NULL
  );

  CREATE TABLE IF NOT EXISTS post (
    post_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    release_date DATE NOT NULL,
    post_content VARCHAR NOT NULL,
    creator INTEGER NULL, 
    FOREIGN KEY (creator) REFERENCES users (user_id)
  );

  CREATE TABLE IF NOT EXISTS post_comments (
    comment_id SERIAL PRIMARY KEY,
   	comment_content VARCHAR NOT NULL,
    commented_post_id INTEGER NOT NULL,
    person_id INTEGER NOT NULL, 
    FOREIGN KEY (person_id) REFERENCES users (user_id),
    FOREIGN KEY (commented_post_id) REFERENCES post (post_id)
  );

  INSERT INTO users (username, role, userpassword, first_name, last_name) VALUES ('admin123', 'admin', 'sha1$3b1e2197$1$b9c5f33b4373a48531bf52162e9908746ed83a13', 'admin', 'adminowski');
  INSERT INTO users (username, role, userpassword, first_name, last_name) VALUES ('dpionk', 'admin', 'sha1$3b1e2197$1$b9c5f33b4373a48531bf52162e9908746ed83a13', 'Daria', 'Pionk');
  `);

		const port = process.env.PORT || 5000
		app.listen(port, () => {
			console.log(`API server listening at http://localhost:${port}`);
		});
	})
	.catch(err => console.error('Connection error', err.stack));






io.on('connection', async (socket) => {
	console.log('New client connected');
	
	
	socket.on('disconnect', () => {

		console.log('Client disconnected');
	});

	socket.on('active', (data) => {
		activeUsers.push(data)
		const MQTTclient = mqtt.connect('ws://localhost:8082/mqtt');

		MQTTclient.subscribe('active');
		MQTTclient.publish('active', JSON.stringify(data));

		MQTTclient.on('message', (t, m) => {
			if (t === 'active') {
				
				socket.emit('active', activeUsers)
				//MQTTclient.end()
			}
		})
	})

	socket.on('logout', (data) => {
		const MQTTclient = mqtt.connect('ws://localhost:8082/mqtt');
		MQTTclient.subscribe('logout');
		MQTTclient.publish('logout', JSON.stringify(data));

		MQTTclient.on('message', (t, m) => {
			if (t === 'logout') {
				activeUsers = activeUsers.filter((user) => {
					return user.user_id !== data
				})
				socket.emit('active', activeUsers)
				MQTTclient.end()
			}
		})
	})

	socket.on('message', (data) => {
		const MQTTclient = mqtt.connect('ws://localhost:8082/mqtt');

		MQTTclient.subscribe('chat');
		MQTTclient.publish('chat', JSON.stringify(data));

		MQTTclient.on('message', (t, m) => {
			if (t === 'chat') {
				socket.emit('message', data)
				//MQTTclient.end()
			}
		})
	})

	socket.on('post', (data) => {
		const MQTTclient = mqtt.connect('ws://localhost:8082/mqtt');

		MQTTclient.subscribe('post');
		MQTTclient.publish('post', JSON.stringify(data));

		MQTTclient.on('message', (t, m) => {
			if (t === 'post') {
				socket.emit('post', data)
				MQTTclient.end()
			}
		})
	})

	socket.on('comment', (data) => {
		const MQTTclient = mqtt.connect('ws://localhost:8082/mqtt');

		MQTTclient.subscribe('comment');
		MQTTclient.publish('comment', JSON.stringify(data));

		MQTTclient.on('message', (t, m) => {
			if (t === 'comment') {
				socket.emit('comment', data)
				MQTTclient.end()
			}
		})
	})
});

server.listen(4001, () => console.log(`Socket listening on port 4001`));