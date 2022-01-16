import { useState } from 'react';
import { Formik, Field } from "formik";
import axios from 'axios';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';



function Login({ setToken, setUser }) {

	const [username, setUserName] = useState();
	const [password, setPassword] = useState();

	const handleValidateRegister = (values) => {
		const errors = {};

		if (!values.username) {
			errors.title = "Tytuł nie może być pusty"
		}
		if (!values.first_name) {
			errors.author = "Autor nie może być pusty"
		}
		if (!values.last_name) {
			errors.genre = "Gatunek nie może być pusty"
		}
	}


	const handleSubmitLogin = async e => {
		e.preventDefault();
		await loginUser({
			username,
			password
		});

	}

	const handleSubmitRegister = async e => {
		e.preventDefault();
		await loginUser({
			username,
			password
		});

	}

	async function loginUser(credentials) {
		axios.post('http://localhost:3000/login', credentials)
			.then((data) => {
				console.log(data)
				const now = new Date();
				now.setTime(now.getTime() + (60 * 1000));
				setToken(data.data.token ? data.data.token : undefined); Cookies.set('token', data.data.token, { expires: now });
				setUser(data.data.user)
				alert('Zalogowano')
			})
			.catch((error) => { console.log(error); alert('Podano błędne dane') })
	}


	return (
		<div>
			<h4>Zaloguj się</h4>
			<form onSubmit={handleSubmitLogin}>
				<div className="form-group">
					<label>Login</label>
					<input type="text" className="form-control" placeholder="podaj swoją nazwę użytkownika" onChange={e => setUserName(e.target.value)} />
				</div>
				<div className="form-group">
					<label>Hasło</label>
					<input type="password" className="form-control" placeholder="hasło" onChange={e => setPassword(e.target.value)} />
				</div>
				<button type="submit" className="btn btn-primary">Zatwierdź</button>
			</form>
			<Formik
				enableReinitialize
				validate={handleValidateRegister}
				onSubmit={handleSubmitRegister}
				initialValues={
					{
						username: '',
						password: '',
						first_name: '',
						last_name: ''
					}
				}
			>
				{
					(formProps) => (
						<form>
							<h4>Zarejestruj się</h4>
							<div className="form-group">
								<label>Login</label>
								<Field type='text' className='form-control' name='username' placeholder='podaj login' >
								</Field>
								{formProps.touched.username && formProps.errors.username ? <div>{formProps.errors.username}</div> : null}
							</div>
							<div className="form-group">
							<label>Hasło</label>
								<Field type='password' className='form-control' name='last_name' placeholder='hasło' >
								</Field>
								{formProps.touched.first_name && formProps.errors.first_name ? <div>{formProps.errors.first_name}</div> : null}
							</div>
							<div className="form-group">
								<label>Imię (imiona)</label>
								<Field type='text' className='form-control' name='first_name' placeholder='imię' >
								</Field>
								{formProps.touched.first_name && formProps.errors.first_name ? <div>{formProps.errors.first_name}</div> : null}
							</div>
							<div className="form-group">
								<label>Nazwisko</label>
								<Field type='text' className='form-control' name='last_name' placeholder='nazwisko' >
								</Field>
								{formProps.touched.last_name && formProps.errors.last_name ? <div>{formProps.errors.last_name}</div> : null}
							</div>
							<button type="submit" className="btn btn-primary">Zatwierdź</button>
						</form>
					)
				}
			</Formik>
		</div>

	);
}

Login.propTypes = {
	setToken: PropTypes.func.isRequired
}

export default Login;
