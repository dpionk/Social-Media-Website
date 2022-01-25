
import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import socketIOClient from 'socket.io-client'
import Cookies from 'js-cookie';
import Navbar from "./navbar/Navbar";
import Login from './Login/Login';
import Profile from './Profile/Profile'
import Main from './Main/Main';
import Chatrooms from './Chatrooms/Chatrooms';
import Post from './Post/Post';
import Settings from './Settings/Settings';
import PageNotFound from './PageNotFound/PageNotFound'

import './App.scss'


function App() {
	const [socket, setSocket]= useState(null)
	const [user, setUser] = useState(Cookies.get('user'));
	const [token, setToken] = useState(Cookies.get('token'));
	const [activeUsers, setActiveUsers] = useState([]);
	const ENDPOINT = "http://127.0.0.1:4001";
	
	useEffect(() => {
		setSocket(socketIOClient(ENDPOINT))
	
	}, []
	);

	if (!token && !user) {
		return <Login setToken={setToken} setUser={setUser} activeUsers={activeUsers} setActiveUsers={setActiveUsers} socket={socket} />
	}


	return (
		<BrowserRouter>
			<div>
				<Navbar user={user} socket={socket}/>
				<div className='container'>
					<Routes>
						<Route exact path='/users/:id' element={<Profile userSession={user}/>}/>
						<Route exact path='/users/:id/posts/:postId' element={<Post socket={socket}/>}></Route>
						<Route exact path='/' element={<Main user={user} socket={socket && socket} activeUsers={activeUsers}/>}></Route>
						<Route exact path='/chatrooms' element={<Chatrooms  user={user} socket={socket}/>}></Route>
						<Route exact path='/posts/:id' element={<Post user={user} socket={socket}/>}></Route>
						<Route exact path='/settings' element={<Settings user={user}/>}></Route>
						<Route path='*' element={<PageNotFound />} />
					</Routes>
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
