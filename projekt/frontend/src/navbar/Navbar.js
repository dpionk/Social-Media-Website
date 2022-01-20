import { Link } from 'react-router-dom';
import { useState } from 'react';
import Cookies from 'js-cookie';
import './Navbar.scss'


function Navbar({user}) {

	const [clicked, setClicked] = useState(false);

	const handleClick = () => {
		setClicked(
			!clicked
		)
	}

	const logout = () => {
		localStorage.clear();
		Cookies.remove('token')
		window.location.href = "/";
	}
	return (
		<div>
			<nav className='navbar navbar-expand-lg navbar-light sticky-top'>
				<div className='container-fluid'>
					<div className='top'>
						<div className='navbar-brand' >
						</div>
						<button className='navbar-toggler' type='button' onClick={handleClick}>
							<span className='navbar-toggler-icon'></span>
						</button>
					</div>
					<div className={"collapse navbar-collapse" + (clicked ? " show" : "")} id="navbarTogglerDemo02">
						<ul className='navbar-nav .navbar-nav-scroll me-auto mb-2 mb-lg-0'>
							<li className='nav-item'>
								<Link to="/" style={{ textDecoration: 'none' }}>
									<div className="nav-link">Strona główna</div>
								</Link>
							</li>
							<li className='nav-item'>
								<Link to={ user ? `/users/${user.id}` : '/'} style={{ textDecoration: 'none' }}>
									<div className="nav-link">Twój profil</div>
								</Link>
							</li>
							<li className='nav-item'>
								<Link to="/chatrooms" style={{ textDecoration: 'none' }}>
									<div className="nav-link">Chaty</div>
								</Link>
							</li>
							<li className='nav-item'>
							<Link to="/" style={{ textDecoration: 'none' }}>
							<button onClick={logout} className="nav-link">
									Wyloguj się
								</button>
								</Link>
								
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</div>
	);
}

export default Navbar;