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
const reactions = require('./routes/reactions')




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
app.use('/reactions', reactions);



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

  CREATE TABLE IF NOT EXISTS active_users (
    active_user_id INTEGER NOT NULL, 
    FOREIGN KEY (active_user_id) REFERENCES users (user_id)
  );

  CREATE TABLE IF NOT EXISTS reactions (
	reaction_id SERIAL PRIMARY KEY,
    reaction_user_id INTEGER NOT NULL, 
	reaction_post_id INTEGER NOT NULL, 
	reaction_type VARCHAR NOT NULL,
	FOREIGN KEY (reaction_post_id) REFERENCES post (post_id),
    FOREIGN KEY (reaction_user_id) REFERENCES users (user_id)
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



const MQTTclient = mqtt.connect('ws://localhost:8082/mqtt');

const subscriptions = new Map();

// {
// 	"chat-room-1": [socket1, socket2]
// }

MQTTclient.on("message", (topic, message) => {
	if (!subscriptions.has(topic)) return;
	const subscribedSockets = subscriptions.get(topic);
	for (const socket of subscribedSockets) {
		socket.emit('message', {topic, message: message.toString()});
	}
});



io.on('connection', async (socket) => {
	socket.on("connect", async () => {
		console.log('New client connected');
	});
	socket.on('disconnect', () => {

		console.log('Client disconnected');
		for (const [topic, subscribedSockets] of subscriptions.entries()) {
			subscribedSockets.delete(socket);
			if (subscribedSockets.size === 0) {
				subscriptions.delete(topic);
				MQTTclient.unsubscribe(topic);
			}
		}
	});

	socket.on("publish", ({topic, message}) => {
		console.log(`Publishing to ${topic}:`, message);
		MQTTclient.publish(topic, message);
	});

	socket.on("subscribe", (topic) => {
		if (!subscriptions.has(topic)) {
			subscriptions.set(topic, new Set());
			MQTTclient.subscribe(topic);
		}
		subscriptions.get(topic).add(socket);
	});
	socket.on("unsubscribe", (topic) => {
		if (!subscriptions.has(topic)) return
		subscriptions.get(topic).delete(socket);
		if (subscriptions.get(topic).size !== 0) return;
		MQTTclient.unsubscribe(topic);
		subscriptions.delete(topic);
	});


});

server.listen(4001, () => console.log(`Socket listening on port 4001`));