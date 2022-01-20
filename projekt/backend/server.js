const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const jwt = require('express-jwt');
const cors = require('cors');
const app = express();
const path = require('path')

const users = [{ 'id' : '1', 'username': 'username', 'password': 'password', 'first_name': 'Daria', 'last_name': 'Pionk' }, {'id': '2', 'username': '1', 'password': '1', 'first_name': 'Mikołaj', 'last_name': 'Kubiak'}]
const jwtSecret = 'secret123';

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname,'build')));


app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.post('/login', (req, res) => {
	
	for (let i in users) {
		if (users[i].username === req.body.username && users[i].password === req.body.password) {
			
			const token = jsonwebtoken.sign({ user: req.body.username }, jwtSecret);
			return res.json({ token:token, user: users[i] });
		}
	}
	return res.status(500).send('wrong').end();
});

app.get('/users/:id', (req, res) => {
	for (let i in users) {
		if (users[i].id === req.params.id) {
			
			return res.json({users: users[i]});
		}
	}
	return res.status(500).send('wrong').end();
})

app.post('/users', (req, res) => {
	
	for (let i in users) {
		if (users[i].username === req.body.username && users[i].password === req.body.password) {
			
			const token = jsonwebtoken.sign({ user: req.body.username }, jwtSecret);
			return res.json({ token:token, user: users[i] });
		}
	}
	return res.status(500).send('wrong').end();
});


const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`API server listening at http://localhost:${port}`);
})