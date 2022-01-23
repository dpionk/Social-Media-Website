import { Formik, Field } from 'formik';
import './Main.scss'
import axios from 'axios';

function Main({ user }) {

	const handleValidate = (values) => {
		const errors = {}

		if (!values.title) {
			errors.title = "Proszę podać tytuł"
		}

		if (!values.post_content) {
			errors.post_content = "Proszę coś napisać"
		}
	}

	const createPost = async (values) => {
		axios.post('http://localhost:5000/posts', values).then((data) => {
			console.log(data);
			alert('Dodano')
		}).catch((error) => {
			console.log(error)
			alert('Coś poszło nie tak')
		})
	}

	const handleSubmit = async (values) => {
		const now = new Date();
		now.setTime(now.getTime());
		values.release_date = now
		await createPost(values);
	}
	return (
		<div className='main'>
			<div className='list-group-item'>
				<div className='form'>
					<Formik
						enableReinitialize
						validate={handleValidate}
						onSubmit={handleSubmit}
						initialValues={
							{
								title: '',
								release_date: '',
								post_content: '',
								creator: user,
							}
						}
					>
						{
							(formProps) => (
								<form>
									<h4>Opublikuj posta</h4>
									<div className="form-group">
										<label>Tytuł</label>
										<Field type='text' className='form-control' name='title' placeholder='podaj tytuł' >
										</Field>
										{formProps.touched.title && formProps.errors.title ? <div>{formProps.errors.title}</div> : null}
									</div>
									<div className="form-group">
										<label>Treść</label>
										<Field as='textarea' className='form-control' name='post_content' placeholder='co Ci chodzi po głowie?' >
										</Field>
										{formProps.touched.post_content && formProps.errors.post_content ? <div>{formProps.errors.post_content}</div> : null}
									</div>
									<button type="button" className="btn btn-primary" onClick={formProps.handleSubmit}>Zatwierdź</button>
								</form>
							)
						}
					</Formik>
				</div>
			</div>
			<div className='active-feed'>
				<div className='activeUsers list-group-item'>
						<h4>Aktywni użytkownicy</h4>
					<div>
						fgfdg
					</div>
				</div>
				<div className='feed list-group-item'>
						<h4>Najnowsze posty</h4>
					<div>
						fgfdg
					</div>
				</div>
			</div>
		</div>
	)
}

export default Main;