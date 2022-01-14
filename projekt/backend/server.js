const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());

const users = [ {'username': 'username', 'password': 'password'}]

app.post('/login', (req, res) => {
	console.log(req.body)
	for (let i in users) {
		if (users[i].username === req.body.username && users[i].password === req.body.password) {
			console.log('dfsdf')
			return res.header("Access-Control-Allow-Origin", "*").send({
				token: 'test123'
			  });
		}
		return res.header("Access-Control-Allow-Origin", "*").status(500).send('wrong').end();
	}
	
  });



app.listen(5000, () => console.log('API is running on http://localhost:5000'));