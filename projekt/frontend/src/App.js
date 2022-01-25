
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
	const [mqtt, setMqtt]= useState(null)
	const [user, setUser] = useState(Cookies.get('user'));
	const [token, setToken] = useState(Cookies.get('token'));
	const [activeUsers, setActiveUsers] = useState([]);
	const ENDPOINT = "http://127.0.0.1:4001";

	useEffect(() => {
		const socket = socketIOClient(ENDPOINT);
		const mqtt = {
			publish: function(topic, message) {
				socket.emit('publish', {topic, message})
			},
			subscribe: function(topic) {
				socket.emit('subscribe', topic)
			},
			unsubscribe: function(topic) {
				socket.emit('unsubscribe', topic)
			},
			messageHandlers: new Set(),
			addMessageHandler: function(messageHandler) {
				this.messageHandlers.add(messageHandler);
			},
			removeMessageHandler: function(messageHandler) {
				this.messageHandlers.delete(messageHandler);
			},
		};
		setMqtt(mqtt);
		socket.on("message", ({topic, message}) => {
			for (const messageHandler of mqtt.messageHandlers) {
				messageHandler(topic, message.toString());
			}
		});
	}, []);

	if (!mqtt) return <div>Loading MQTT...</div>;
	if (!token && !user) {
		return <Login setToken={setToken} setUser={setUser} activeUsers={activeUsers} setActiveUsers={setActiveUsers} mqtt={mqtt} />
	}
	return (
		<BrowserRouter>
			<div>
				<Navbar user={user} mqtt={mqtt}/>
				<div className='container'>
					<Routes>
						<Route exact path='/users/:id' element={<Profile userSession={user}/>}/>
						<Route exact path='/users/:id/posts/:postId' element={<Post mqtt={mqtt}/>}></Route>
						<Route exact path='/' element={<Main user={user} activeUsers={activeUsers} mqtt={mqtt}/>}></Route>
						<Route exact path='/chatrooms' element={<Chatrooms  user={user} mqtt={mqtt}/>}></Route>
						<Route exact path='/posts/:id' element={<Post user={user} mqtt={mqtt}/>}></Route>
						<Route exact path='/settings' element={<Settings user={user}/>}></Route>
						<Route path='*' element={<PageNotFound />} />
					</Routes>
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
