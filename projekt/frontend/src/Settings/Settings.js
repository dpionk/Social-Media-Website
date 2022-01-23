import { Formik, Field } from "formik";
import Cookies from 'js-cookie';
import axios from 'axios';
import './Settings.scss'

function Settings ({user}) {

	const logout = () => {
		localStorage.clear();
		Cookies.remove('token')
		Cookies.remove('user')
		window.location.href = "/";
	}

	const handleSubmitChangePassword = (values) => {
		axios.put(`http://localhost:5000/users/password/${user}`, values)
			.then(() => {
				alert('Hasło zmienione. Wymagane ponowne zalogowanie.')
				logout();
			})
			.catch((error) => { console.log(error); alert('Podano błędne dane')})

	}
	return (
		<div className='list-group-item'>
			<div>
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
										<button type="button" className="btn btn-primary" onClick={formProps.handleSubmit}>Zatwierdź</button>
									</form>
								)
							}
						</Formik>
					</div>
			</div>
			<div>
			<h4>
				<button>Usuń swoje konto</button>
			</h4>
			</div>
		</div>

	)
}

export default Settings;