import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from "./navbar/Navbar";
import Login from './Login/Login';



function App() {

	const [token, setToken] = useState();

	if (!token) {
		return <Login setToken={setToken}/>
	}
	return (
		<BrowserRouter>
			<div>
				<Navbar />
			</div>
		</BrowserRouter>
	);
}

export default App;
