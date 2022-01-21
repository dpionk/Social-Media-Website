import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RiArrowGoBackLine } from 'react-icons/ri';
import { GrUserAdmin } from 'react-icons/gr'
import axios from 'axios';
import './Profile.scss'


function Profile() {
	const { id } = useParams();
	const history = useNavigate();

	const [user, setUser] = useState();
	const [posts, setPosts] = useState();

	useEffect(() => {
		axios.get(`http://localhost:5000/users/${id}`).then((response) => {
			setUser(response.data)
		}).catch(error => {
			console.log(error)
		}).finally(() => {
			//setLoading(false);
		})

		axios.get(`http://localhost:5000/posts/${id}`).then((response) => {
			setPosts(response.data)
		}).catch(error => {
			console.log(error)
		}).finally(() => {
			//setLoading(false);
		})

	}, [id]
	);

	console.log(posts)

	return (

		<div className="person">
			{user && posts &&
				<div className="list-group-detailed">
					<div className="list-group-item">
						<div className="img">
							<img src={user.picture ? user.picture : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} alt="" />
						</div>
						<div className="info-buttons">
							<div className="ta">
								<div className="user-back">
									<div className="user">
										{user.username} {user.role === 'admin' ? <GrUserAdmin /> : null}
									</div>
									<div className="button-back">
										<button className="btn" type="button" onClick={() => { history(-1); }}><RiArrowGoBackLine /></button>
									</div>
								</div>
								<div>
									Imię: {user.first_name}
								</div>
								<div>
									Nazwisko: {user.last_name}
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
									{posts.map((post) => {
										return (
											<li className='post' key={post.id}>
												<div className='title'>{post.title}</div>
												<div className='content'>{post.post_content}</div>
											</li>
										)
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
