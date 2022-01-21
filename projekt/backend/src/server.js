const express = require('express');
const app = express();
const client = require('./config/psqlClient');
const users = require('./routes/users');
const cors = require('cors');

//const path = require('path')



app.use(express.json());
//app.use(cors());

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
	res.header(
	  'Access-Control-Allow-Headers',
	  'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
  });
//app.use(express.static(path.join(__dirname,'build')));
app.use('/users', users);

//app.get('/', (req, res) => {
//	res.sendFile(path.join(__dirname, 'build', 'index.html'));
//})

client
.connect()
.then(() => {
  console.log('Connected to PostgreSQL');

  client.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
	username VARCHAR(60) NOT NULL,
	userpassword VARCHAR(60) NOT NULL,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL
  );

  `);

  const port = process.env.PORT || 5000
  app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
  });
})
.catch(err => console.error('Connection error', err.stack));