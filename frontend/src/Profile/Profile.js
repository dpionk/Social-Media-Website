import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { Formik, Field } from 'formik';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { RiArrowGoBackLine } from 'react-icons/ri';
import { GrUserAdmin } from 'react-icons/gr'
import {  AiFillEdit, AiFillDelete } from 'react-icons/ai'
import axios from 'axios';
import './Profile.scss'


function Profile({ userSession, isAdmin, mqtt, setActiveUsers }) {
	const { id } = useParams();
	const history = useNavigate();


	const [user, setUser] = useState();
	const [posts, setPosts] = useState();
	const [showAddPicture, setShowAddPicture] = useState(false);


	useEffect(() => {
		
		mqtt.subscribe("logout");

		const handleMessage = (topic, user) => {
			
			if (topic !== "logout") return;
			setActiveUsers((activeUsers) => activeUsers.filter((users) => {
				return users.user_id !== parseInt(user)
			}));
			localStorage.clear();
			Cookies.remove('token')
			Cookies.remove('user')
			window.location.href = "/";
		};

		mqtt.addMessageHandler(handleMessage);

		//return () => {
		//	mqtt.unsubscribe("logout");
		//	mqtt.removeMessageHandler(handleMessage);
		//}

	}, [mqtt, setActiveUsers]);


	const logout = () => {
		axios.delete(`http://localhost:5000/users/active/${user.user_id}`).then(() => {
			mqtt.publish("logout", JSON.stringify(user.user_id));
		}).catch((error) => {
			console.log(error)
			alert('Coś poszło nie tak')
		})

	}

	const deleteUser =  async () => {
		await logout();
		axios.delete(`http://localhost:5000/users/${user.user_id}`).then(async () => {
			
			alert('Usunięto profil :(')
			history('/')
			
		}).catch(error => {
			console.log(error)
		}).finally(() => {
			//setLoading(false);
		})
	}

	const downloadUser = () => {
		axios.get(`http://localhost:5000/users/${id}`).then((response) => {
			setUser(response.data)
		}).catch(error => {
			console.log(error)
		}).finally(() => {
			//setLoading(false);
		})
	}

	const downloadPosts = () => {
		axios.get(`http://localhost:5000/posts/author/${id}`).then((response) => {
			setPosts(response.data)
		}).catch(error => {
			console.log(error)
		}).finally(() => {
			//setLoading(false);
		})
	}


	useEffect(() => {
		downloadUser();
		downloadPosts();
		

	}, [id]
	);

	const handleSubmit = async (values) => {
		await axios.put(`http://localhost:5000/users/${id}`, values).then(() => {
			downloadUser();
			setShowAddPicture(false);
			alert('Udało się');

		}).catch(error => {
			console.log(error)
		}).finally(() => {
			//setLoading(false);
		})
	}

	return (

		<div className="person">
			{user && posts &&
				<div className="list-group-detailed">
					<div className="list-group-item">
						<div className="img">
							<img src={user.picture ? user.picture : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} alt="" />
							{parseInt(userSession) === user.user_id? <button className="btn" type="button" onClick={() => setShowAddPicture(!showAddPicture)}><AiFillEdit /></button> : null}
							{showAddPicture ? <div className='form'>
								<Formik
									enableReinitialize
									//validate={handleValidate}
									onSubmit={handleSubmit}
									initialValues={
										{
											picture: ''
										}
									}
								>
									{
										(formProps) => (
											<form>
												<div className="form-group">
													<label>Zmień zdjęcie profilowe</label>
													<Field type='text' className='form-control' name='picture' >
													</Field>
													{formProps.touched.picture && formProps.errors.picture ? <div>{formProps.errors.picture}</div> : null}
												</div>
												<button type="button" className="btn" onClick={formProps.handleSubmit}>Zatwierdź</button>
											</form>
										)
									}
								</Formik>
							</div> : null}
						</div>
						<div className="info-buttons">
							<div className="ta">
								<div className="user-back">
									<div className="user">
										{user.username} {user.role === 'admin' ? <GrUserAdmin /> : null}
									</div>
									<div className="button-back">
									{isAdmin === true ?  <button className="btn" type="button" onClick={deleteUser}><AiFillDelete /></button> : null}
										<button className="btn" type="button" onClick={() => { history(-1); }}><RiArrowGoBackLine /></button>
									</div>
								</div>
								<div>
									{user.first_name} {user.last_name}
								</div>
							</div>
						</div>
						
					</div>
					<div className="list-group-item">
						<div className='posts'>
							<div>
								<h4>Posty użytkownika</h4>
							</div>
							<div className='posts-list'>
								<ul>
									{	posts.map((post) => {
										return (
											<li className='post' key={post.post_id}>
												<div className='edit-post'>
													<div className='title'><Link to={`/posts/${post.post_id}`} style={{ textDecoration: 'none', color: 'black' }}>{post.title}</Link></div>
													<div>
													</div>
												</div>

												<div className='content'>{post.post_content}</div>
											</li>
										)
									}).sort((a, b) => {
										
										return (a.post_creation_date  > b.post_creation_date) ? 1 : -1
									})}
								</ul>
							</div>
						</div>
						
					</div>
				</div>
			}
		</div>
	);
}

export default Profile;
