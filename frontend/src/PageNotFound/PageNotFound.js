import { Link } from 'react-router-dom'

function PageNotFound() {
	return (
		<div>
			<h2> Przepraszamy :( </h2>
			<p>Taka strona nie istnieje</p>
			<Link to='/'>Wróć na stronę główną...</Link> 
		</div>
	);
}

export default PageNotFound;