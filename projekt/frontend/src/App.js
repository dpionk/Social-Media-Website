import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from "./navbar/Navbar";
import Login from './Login/Login';
import Profile from './Profile/Profile'



function App() {
	const [user, setUser] = useState();
	const [token, setToken] = useState(Cookies.get('token'));

	if (!token) {
		return <Login setToken={setToken} setUser={setUser} />
	}

	console.log(user)
	return (
		<BrowserRouter>
			<div>
				<Navbar user={user}/>
				<div className='container'>
					<Routes>
						{ <Route exact path='/users/:id' element={<Profile ActualUser={user}/>}/>}
					</Routes>
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
