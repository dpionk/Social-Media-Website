import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RiArrowGoBackLine } from 'react-icons/ri';
import axios from 'axios';
import './Profile.scss'


function Profile({ActualUser}) {
	const { id } = useParams();
	const history = useNavigate();

	const [user, setUser] = useState();

	useEffect(() => {
		axios.get(`http://localhost:5000/users/${id}`).then((response) => {
			setUser(response.data)
		}).catch(error => {
			console.log(error)
		}).finally(() => {
			//setLoading(false);
		})

	}, [id]
	);

	return (

		<div className="person">
			{ user && 
					<div className="list-group-detailed">
						<div className="list-group-item">
							<div className="img">
								<img src='https://i.stack.imgur.com/1RZta.png' alt="" />
							</div>
							<div className="info-buttons">
								<div className="ta">
									<div className="user-back">
										<div className="user">
											{user.first_name} {user.last_name}
										</div>
										<div className="button-back">
											<button className="btn" type="button" onClick={() => {history(-1);}}><RiArrowGoBackLine /></button>
										</div>
									</div>
									<div>
										aa
									</div>
									<div>
										aa
									</div>
								</div>
							</div>
						</div>
						<div className="list-group-item">
							<div>
								Posty
							</div>
							<div>
								<ul>
									<li>
										post1
									</li>
									<li>
										post2
									</li>
									<li>
										post3
									</li>
								</ul>
							</div>
						</div>
					</div>
					}
				</div>
	);
}

export default Profile;
