import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Field, Formik } from 'formik';
import { ImExit } from 'react-icons/im'

function Chatroom({ mqtt, user, userInfo, chatroom, setChatroom }) {

	const [messages, setMessages] = useState([{ 'id': 'bot', 'author': 'Chat bot', 'message': `Witaj na chacie ${chatroom} :) Aby zaprosić swoich znajomych, wyślij im nazwę Twojego pokoju!` }]);

	useEffect(() => {

		mqtt.subscribe(`chat/${chatroom}`);
		const handleMessage = (topic, message) => {
			if (topic !== `chat/${chatroom}`) return;
			setMessages((messages) => [...messages, JSON.parse(message)]);
		};

		mqtt.addMessageHandler(handleMessage);

		return () => {
			mqtt.unsubscribe(`chat/${chatroom}`);
			mqtt.removeMessageHandler(handleMessage);
		}

	}, [mqtt, chatroom]);


	const handleSubmit = values => {
		mqtt.publish(`chat/${chatroom}`, JSON.stringify(values));
	}

	return (
		<div className='chatroom'>
			{userInfo &&
				<div className='container'>
					<div className='room-quit'>
						<h4>{chatroom}</h4>
						<button className=' btn btn-primary' onClick={() => { mqtt.unsubscribe(`chat/${chatroom}`); setChatroom(null) }}><ImExit /></button>
					</div>
					<div className='messages'>
						{messages.map(message => {
							return (
								<div className='message list-group-item' key={Math.random()}>
									<p>{message.id !== 'bot' ? <Link to={`/users/${message.id}`}>{message.author}</Link> : message.author}</p>
									<p>{message.message}</p>
								</div>
							)
						})}
					</div>
					<div className='form'>
						<Formik
							enableReinitialize
							//validate={handleValidateRegister}
							onSubmit={(values, {resetForm} ) => {handleSubmit(values); resetForm(
								{
									id: user,
									author: userInfo.username,
									message: ''
								}
							)}}
							initialValues={
								{
									id: user,
									author: userInfo.username,
									message: ''
								}
							}
						>
							{
								(formProps) => (
									<form>

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
				</div>}
		</div>
	);
}

export default Chatroom;