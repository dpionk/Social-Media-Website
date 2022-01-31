import { useState, useEffect } from 'react';
import { Field, Formik } from 'formik';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Chatrooms.scss'
import Chatroom from './Chatroom';

function Chatrooms({ mqtt, user }) {

	const [chatRoom, setChatRoom] = useState(null)
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
	}, []);

	if (chatRoom) {
		return <Chatroom mqtt={mqtt} user={user} userInfo={userInfo} chatroom={chatRoom} setChatroom={setChatRoom}/>
	}
	return (
		<div className='chatroom'>
			{ userInfo && 
			<div className='container'>
			<h4>Witaj! Wpisz nazwę pokoju, do którego chcesz dołączyć</h4>
			<div className='form'>
				<Formik
					enableReinitialize
					//validate={handleValidateRegister}
					onSubmit={(values) => setChatRoom(values.room)}
					initialValues={
						{
							room: ''
						}
					}
				>
					{
						(formProps) => (
							<form>
								
								<div className='form-group'>
									<Field type='text' className='form-control' name='room' placeholder='wpisz nazwę pokoju...' >
									</Field>
									{formProps.touched.room && formProps.errors.room ? <div>{formProps.errors.room}</div> : null}
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