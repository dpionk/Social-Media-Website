import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Search.scss'

function Search() {

	const { regex } = useParams();
	const [users, setUsers] = useState([]);

	useEffect(() => {

		axios.get(`http://localhost:5000/users/matches/${regex}`).then((response) => {
			setUsers(response.data)
		}).catch(error => {
			console.log(error)
		})
	}, [regex]);

	return (
		<div className='regex'>
			<div className='list-group-item'>
				<h4>Wyniki wyszukiwania</h4>
				{
					users && users.length > 0 ? users.map((user) => {
						return (
							<div className='user' key={user.user_id}>
								<img src={user.picture ? user.picture : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} alt='user' />
								<div className='username'><Link style={{ textDecoration: 'none', color:'black'}} to={`/users/${user.user_id}`}>{user.username}</Link></div>
							</div>
						)
					}) :
						<div>Brak wyników</div>
				}
			</div>
		</div>
	)
}

export default Search;