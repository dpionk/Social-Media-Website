const users = []

const userJoin = (id, login, room) => {
	 const user = { id, login, room };
	 users.push(user);
	 return user;
}

const getCurrentUser = (id) => {
	return users.filter(user => user.id === id)
}

const userLeaves = (id) => {
	const index = users.findIndex(user => user.id === id);

	if (index !== - 1) {
		return users.splice(index,1)[0];
	}
}

module.exports = {
	userJoin,
	getCurrentUser,
	userLeaves
}