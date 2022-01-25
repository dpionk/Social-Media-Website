import { useState, useEffect } from 'react';
import { Formik, Field } from "formik";
import axios from 'axios';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import './Login.scss'



function Login({ setToken, setUser, setIsAdmin, active, setActiveUsers, mqtt }) {

	const [username, setUserName] = useState();
	const [password, setPassword] = useState();

	console.log(active)
	useEffect(() => {
		
		mqtt.subscribe("active");

		const handleMessage = (topic, user) => {
			if (topic !== "active") return;
			setActiveUsers((activeUsers) => [...activeUsers, JSON.parse(user)]);
		};

		mqtt.addMessageHandler(handleMessage);

		//return () => {
		//	mqtt.unsubscribe("active");
		//	mqtt.removeMessageHandler(handleMessage);
		//}

	}, [mqtt, setActiveUsers]);

	const handleValidateRegister = (values) => {
		const errors = {};

		if (!values.username) {
			errors.username = "Proszę podać nazwę użytkownika"
		}
		if (!values.password) {
			errors.password = "Proszę podać hasło"
		}
		if (!values.first_name) {
			errors.first_name = "Proszę podać imię"
		}
		if (!values.last_name) {
			errors.last_name = "Proszę podać nazwisko"
		}
		return errors;
	}


	const handleSubmitLogin = async e => {
		e.preventDefault();
		await loginUser({
			username,
			password
		});

	}

	const handleSubmitRegister = async values => {
		await createUser(values);

	}

	async function loginUser(credentials) {

		axios.post('http://localhost:5000/users/login', credentials)
			.then((data) => {
				const now = new Date();
				now.setTime(now.getTime() + (60 * 1000));
				setToken(data.data.token ? data.data.token : undefined);
				Cookies.set('token', data.data.token, { expires: now });
				Cookies.set('user', data.data.user.user_id, { expires: now });
				{ data.data.user.role === 'default' ? setIsAdmin(false) : setIsAdmin(true)}
				setUser(data.data.user.user_id);

				mqtt.publish("active", JSON.stringify(data.data.user));
				
				alert('Zalogowano')
			})
			.catch((error) => { if (error.message === "Network Error") {alert('Coś poszło nie tak')} else { alert('Podano błędne dane')}  })
	}

	async function createUser(values) {
		axios.post('http://localhost:5000/users/', values).then(() => {
			alert('Zarejestrowano! Możesz się już zalogować.')
		})
			.catch((error) => { 
				if (error.message === "Network Error") {alert('Coś poszło nie tak')} else { alert('Istnieje już użytkownik o takiej nazwie')} })
	}
	return (
		<div className='login'>
			<div>
				<h4>Witamy na naszym portalu społecznościowym!</h4>
			</div>
			<div className='list-group-item'>
				<div className='forms'>
					<div className='form'>
						<form onSubmit={handleSubmitLogin}>
							<h4>Zaloguj się</h4>
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
					</div>
					<div className='form'>
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
											<Field type='password' className='form-control' name='password' placeholder='hasło' >
											</Field>
											{formProps.touched.first_name && formProps.errors.password ? <div>{formProps.errors.password}</div> : null}
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
										<button type="button" className="btn btn-primary" onClick={formProps.handleSubmit}>Zatwierdź</button>
									</form>
								)
							}
						</Formik>
					</div>
				</div>
			</div>
		</div>
	);
}

Login.propTypes = {
	setToken: PropTypes.func.isRequired
}

export default Login;
