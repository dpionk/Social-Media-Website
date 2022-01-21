import axios from 'axios';
import { Field, Formik } from 'formik';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Post ({user}) {

	const [post, setPost] = useState();
	const { id } = useParams();

	const downloadPost = () => {
		axios.get(`http://localhost:5000/posts/${id}`).then((response) => {
			setPost(response.data[0])
		}).catch(error => {
			console.log(error)
		}).finally(() => {
			//setLoading(false);
		})
	}

	const handleSubmit = (values) => {
		console.log(values)
		axios.post(`http://localhost:5000/comments/${id}`, values).then(() => {
			alert('Dodano')
		}).catch(error => {
			console.log(error)
			alert('Coś poszło nie tak')
		}).finally(() => {
			//setLoading(false);
		})
	}

	const handleValidate = (values) => {
		const errors = {};

		if (values.content === '') {
			errors.content = 'Proszę wpisać komentarz'
		}

		return errors
	}

	useEffect(() => {
		downloadPost();
		

	}, [id]
	);

	return (
		<div>
			{post && <div>{post.title}
			{post.post_content}
			</div>
			}
			<div className='form'>
				<Formik
					enableReinitialize
					validate={handleValidate}
					onSubmit={handleSubmit}
					initialValues={
						{
							author: user,
							content: ''
						}
					}
				>
					{
						(formProps) => (
							<form>
								<div className='form-group'>
									<Field type='text' as='textarea' className='form-control' name='content' placeholder='dodaj komentarz...' >
									</Field>
									{formProps.touched.content && formProps.errors.content ? <div>{formProps.errors.content}</div> : null}
								</div>
								<button type='button' className='btn btn-primary' onClick={formProps.handleSubmit}>Zatwierdź</button>
							</form>
						)
					}
				</Formik>
			</div>
		</div>
	)
}

export default Post;