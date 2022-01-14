import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

async function loginUser(credentials) {
	axios.post('http://localhost:5000/login', credentials)
	.then(data => console.log(data))
	.catch(error => console.log(error))
   }


function Login({ setToken }) {

	const [username, setUserName] = useState();
	const [password, setPassword] = useState();

	const handleSubmit = async e => {
		e.preventDefault();
		const token = await loginUser({
		  username,
		  password
		});
		setToken(token);
	  }

	return (
		<form onSubmit={handleSubmit}>
			<label>
				<p>Username</p>
				<input type="text" onChange={e => setUserName(e.target.value)}/>
			</label>
			<label>
				<p>Password</p>
				<input type="password" onChange={e => setPassword(e.target.value)}/>
			</label>
			<div>
				<button type="submit">Submit</button>
			</div>
		</form>
	);
}

Login.propTypes = {
	setToken: PropTypes.func.isRequired
}

export default Login;
