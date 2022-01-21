import { useState, useEffect } from 'react';
import { Field, Formik } from 'formik';


function Chatrooms({ client, user }) {


	client.subscribe('chat');


	const [messages, setMessages] = useState([{'author': 'Chat bot', 'message': 'Witaj na chacie ogólnym :)'}]);
	client.on('message', (t, m) => {
		if (t === 'chat') {
			const [author, message] = m.toString().split(':')
			setMessages([...messages, { author: author, message: message }])
		}
	})

	const handleSubmit = values => {
		client.publish('chat', `${values.username}:${values.message}`)
	}

	return (
		<div>
			{messages.map(message => {
				return (
					<div>
					<p>{message.author}</p>
					<p>{message.message}</p>
					</div>
				)
			})}
			<div className='form'>
				<Formik
					enableReinitialize
					//validate={handleValidateRegister}
					onSubmit={handleSubmit}
					initialValues={
						{
							username: user,
							message: ''
						}
					}
				>
					{
						(formProps) => (
							<form>
								<h4>Chat ogólny</h4>
								<div className='form-group'>
									<Field type='text' as='textarea' className='form-control' name='message' placeholder='wpisz wiadomość...' >
									</Field>
									{formProps.touched.message && formProps.errors.message ? <div>{formProps.errors.message}</div> : null}
								</div>
								<button type='button' className='btn btn-primary' onClick={formProps.handleSubmit}>Zatwierdź</button>
							</form>
						)
					}
				</Formik>
			</div>
		</div>
	);
}

export default Chatrooms;