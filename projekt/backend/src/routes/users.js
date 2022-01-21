const express = require("express");
const client = require('../config/psqlClient');
const router = express.Router({mergeParams: true});
const jsonwebtoken = require('jsonwebtoken');
const jwt = require('express-jwt');
const passwordHash = require('password-hash')

const messages = {
    USERNAME_DUPLICATE: 'USERNAME_DUPLICATE',
    USER_DOES_NOT_EXISTS: 'USER_DOES_NOT_EXIST', 
    WRONG_LOGIN_CREDENTIALS: 'WRONG_LOGIN_CREDENTIALS'
};

//const users = [{ 'id' : '1', 'username': 'username', 'password': 'password', 'first_name': 'Daria', 'last_name': 'Pionk' }, {'id': '2', 'username': '1', 'password': '1', 'first_name': 'Mikołaj', 'last_name': 'Kubiak'}]
const jwtSecret = 'secret123';

router.get('/', async (req, res) => {
    const users = await client.query("SELECT * FROM users");
    return res.send(users.rows);
});

router.post('/login',async  (req, res) => {

	const userRows = await client.query("SELECT * FROM users WHERE username = $1", [req.body.username]);
	const user = userRows.rows[0]; 
	if(!user) {
        return res.status(500).send(messages.USER_DOES_NOT_EXIST);
    }

	if (passwordHash.verify(req.body.password, user.userpassword)) {
		const token = jsonwebtoken.sign({ user: req.body.username }, jwtSecret);
		return res.json({ token:token, user: user });
	}

	return res.status(500).send(messages.USER_DOES_NOT_EXIST);
;
});

router.get('/:id', async  (req, res) => {
	const id = req.params.id;
	const userRows = await client.query("SELECT * FROM users WHERE id = $1", [id]); 
	const user = userRows.rows[0];

	if(!user) {
        return res.status(500).send(messages.USER_DOES_NOT_EXIST);
    }

    return res.send(user);
})

router.post('/', async (req, res) => {
	const userToAdd = req.body;
	const hashedPassword = passwordHash.generate(userToAdd.password)
	const duplicate = await client.query("SELECT * FROM users WHERE username = $1", [ userToAdd.username ]);
	
	if(duplicate.rows[0]) {
        return res.status(500).send(messages.USERNAME_DUPLICATE);
    }

	const insertedUserRows = await client.query(
        "INSERT INTO users (username, userpassword, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *",
        [userToAdd.username, hashedPassword, userToAdd.first_name, userToAdd.last_name]
      );

    const insertedUser = insertedUserRows.rows[0];
    return res.send(insertedUser);  
});

module.exports = router;
