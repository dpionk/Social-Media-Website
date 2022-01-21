const express = require('express');
const app = express();
const client = require('./config/psqlClient');
const users = require('./routes/users');
const posts = require('./routes/posts');
const comments = require('./routes/comments');
//const cors = require('cors');

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
app.use('/posts', posts);
app.use('/comments', comments);

//app.get('/', (req, res) => {
//	res.sendFile(path.join(__dirname, 'build', 'index.html'));
//})

client
.connect()
.then(() => {
  console.log('Connected to PostgreSQL');

  client.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
	role VARCHAR NOT NULL,
	username VARCHAR(60) NOT NULL,
	userpassword VARCHAR(60) NOT NULL,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
	picture VARCHAR NULL
  );

  CREATE TABLE IF NOT EXISTS post (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    release_date DATE NOT NULL,
    post_content VARCHAR NOT NULL,
    creator INTEGER NULL, 
    FOREIGN KEY (creator) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS post_comments (
    id SERIAL PRIMARY KEY,
   	comment_content VARCHAR NOT NULL,
    post_id INTEGER NOT NULL,
    person_id INTEGER NOT NULL, 
    FOREIGN KEY (person_id) REFERENCES users (id),
    FOREIGN KEY (post_id) REFERENCES post (id)
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