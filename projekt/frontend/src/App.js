
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
import Search from './Search/Search'
import './App.scss'
import axios from 'axios';


function App() {
	const [activeUsers, setActiveUsers] = useState([]);
	const [mqtt, setMqtt] = useState(null)
	const [user, setUser] = useState(Cookies.get('user'));
	const [token, setToken] = useState(Cookies.get('token'));
	const [isAdmin, setIsAdmin] = useState(false);

	const ENDPOINT = "http://127.0.0.1:4001";

	const getActiveUsers = () => {
		axios.get(`http://localhost:5000/users/active`).then((response) => {
			setActiveUsers(response.data)
		}).catch(error => {
			console.log(error)
		}).finally(() => {
			//setLoading(false);
		})

	}
	useEffect(() => {
		if (token && user) {
			const now = new Date();
			now.setTime(now.getTime() + (60 * 1000));
			Cookies.set('token', token, { expires: now });
			Cookies.set('user', user, { expires: now });
			getActiveUsers();
		}
	
		const socket = socketIOClient(ENDPOINT);
		const mqtt = {
			publish: function (topic, message) {
				socket.emit('publish', { topic, message })
			},
			subscribe: function (topic) {
				socket.emit('subscribe', topic)
			},
			unsubscribe: function (topic) {
				socket.emit('unsubscribe', topic)
			},
			messageHandlers: new Set(),
			addMessageHandler: function (messageHandler) {
				this.messageHandlers.add(messageHandler);
			},
			removeMessageHandler: function (messageHandler) {
				this.messageHandlers.delete(messageHandler);
			},
		};
		setMqtt(mqtt);
		socket.on("message", ({ topic, message }) => {
			for (const messageHandler of mqtt.messageHandlers) {
				messageHandler(topic, message.toString());
			}
		});



	}, []);

	const logout = () => {
		axios.delete(`http://localhost:5000/users/active/${user}`).then(() => {
			mqtt.publish("logout", JSON.stringify(user));
			Cookies.remove('token')
			Cookies.remove('user')
			setUser(null)
			setToken(null)
		}).catch((error) => {
			console.log(error)
			alert('Coś poszło nie tak')
		})

	}

	if (!mqtt) return <div>Loading MQTT...</div>;

	if (!token && !user) {
		return <Login setToken={setToken} setUser={setUser} mqtt={mqtt} setActiveUsers={setActiveUsers} active={activeUsers} setIsAdmin={setIsAdmin} getActiveUsers={getActiveUsers} />
	}


	return (
		<BrowserRouter>
			<div>
				<Navbar user={user} mqtt={mqtt} setActiveUsers={setActiveUsers} logout={logout} />
				<div className='container'>
					<Routes>
						<Route exact path='/users/:id' element={<Profile userSession={user} isAdmin={isAdmin} activeUsers={activeUsers} mqtt={mqtt} />} />
						<Route exact path='/' element={<Main user={user} mqtt={mqtt} activeUsers={activeUsers} />}></Route>
						<Route exact path='/chatrooms' element={<Chatrooms user={user} mqtt={mqtt} />}></Route>
						<Route exact path='/posts/:id' element={<Post user={user} mqtt={mqtt} isAdmin={isAdmin} />}></Route>
						<Route exact path='/settings' element={<Settings user={user} mqtt={mqtt} />}></Route>
						<Route exact path='/users/search/:regex' element={<Search />}></Route>
						<Route path='*' element={<PageNotFound />} />
					</Routes>
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
