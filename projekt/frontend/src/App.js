import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from "./navbar/Navbar";
import Login from './Login/Login';
import Profile from './Profile/Profile'
import Main from './Main/Main';
import Chatrooms from './Chatrooms/Chatrooms';
import Post from './Post/Post';
import './App.scss'


function App() {
	const [user, setUser] = useState(Cookies.get('user'));
	const [token, setToken] = useState(Cookies.get('token'));

	if (!token && !user) {
		return <Login setToken={setToken} setUser={setUser} />
	}

	return (
		<BrowserRouter>
			<div>
				<Navbar user={user}/>
				<div className='container'>
					<Routes>
						<Route exact path='/users/:id' element={<Profile/>}/>
						<Route exact path='/users/:id/posts/:postId' element={<Post/>}></Route>
						<Route exact path='/' element={<Main user={user}/>}></Route>
						<Route exact path='/chatrooms' element={<Chatrooms/>}></Route>
					</Routes>
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
