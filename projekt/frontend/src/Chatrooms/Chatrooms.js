import { useState, useEffect } from 'react';
import { Field, Formik } from 'formik';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Chatrooms.scss'

function Chatrooms({ socket, user }) {

	const [messages, setMessages] = useState([{ 'id' : 'bot', 'author': 'Chat bot', 'message': 'Witaj na chacie ogólnym :)' }]);
	const [userInfo,setUserInfo] = useState(null);


	const downloadUser = () => {
		axios.get(`http://localhost:5000/users/${user}`).then((response) => {
			setUserInfo(response.data)
		}).catch(error => {
			console.log(error)
		}).finally(() => {
			//setLoading(false);
		})
	}


	useEffect(() => {
		downloadUser();
		socket.on('message', data => {
			setMessages([...messages, data])
		});
	}, [messages]);



	const handleSubmit = values => {
		socket.emit('message', values);
	}

	return (
		<div className='chatroom'>
			{ userInfo && 
			<div className='container'>
			<h4>Chat ogólny</h4>
			<div className='messages'>
			{messages.reverse().map(message => {
				return (
					<div className='message list-group-item' key={Math.random()}>
							<p>{ message.id !== 'bot' ? <Link to={`/users/${message.id}`}>{message.author}</Link> : message.author }</p>
							<p>{message.message}</p>
					</div>
				)
			})}
			</div>
			<div className='form'>
				<Formik
					enableReinitialize
					//validate={handleValidateRegister}
					onSubmit={handleSubmit}
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

export default Chatrooms;