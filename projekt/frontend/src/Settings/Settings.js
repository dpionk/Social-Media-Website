import { Formik, Field } from "formik";
import Cookies from 'js-cookie';
import axios from 'axios';
import './Settings.scss'

function Settings({ user, mqtt }) {


	const logout = () => {
		axios.delete(`http://localhost:5000/users/active/${user}`).then(() => {
			mqtt.publish("logout", JSON.stringify(user));
			localStorage.clear();
			Cookies.remove('token')
			Cookies.remove('user')
			Cookies.remove('admin')
			window.location.href = "/";
		}).catch((error) => {
			console.log(error)
			alert('Coś poszło nie tak')
		})

	}
	const deleteUser = async () => {
		await logout(user);
		axios.delete(`http://localhost:5000/users/${user}`).then(async () => {

			alert('Usunięto profil :(')

		}).catch(error => {
			console.log(error)
		}).finally(() => {
			//setLoading(false);
		})
	}


	const handleSubmitChangePassword = (values) => {
		axios.put(`http://localhost:5000/users/password/${user}`, values)
			.then(() => {
				alert('Hasło zmienione. Wymagane ponowne zalogowanie.')
				logout();
			})
			.catch((error) => { console.log(error); alert('Podano błędne dane') })

	}
	return (
		<div className='settings'>
			<div className='list-group-item'>
				<div className='form'>
					<Formik
						enableReinitialize
						//validate={handleValidateRegister}
						onSubmit={handleSubmitChangePassword}
						initialValues={
							{
								Oldpassword: '',
								Newpassword: ''
							}
						}
					>
						{
							(formProps) => (
								<form>
									<h4>Zmień hasło</h4>
									<div className="form-group">
										<label>Aktualne hasło</label>
										<Field type='password' className='form-control' name='Oldpassword' placeholder='podaj aktualne hasło' >
										</Field>
										{formProps.touched.Oldpassword && formProps.errors.Oldpassword ? <div>{formProps.errors.Oldpassword}</div> : null}
									</div>
									<div className="form-group">
										<label>Nowe hasło</label>
										<Field type='password' className='form-control' name='Newpassword' placeholder='nowe hasło' >
										</Field>
										{formProps.touched.first_name && formProps.errors.Newpassword ? <div>{formProps.errors.Newpassword}</div> : null}
									</div>
									<button type="button" className="btn" onClick={formProps.handleSubmit}>Zatwierdź</button>
								</form>
							)
						}
					</Formik>
				</div>
				<button className='btn' onClick={() => deleteUser()}>Usuń swoje konto</button>

			</div>

		</div>

	)
}

export default Settings;