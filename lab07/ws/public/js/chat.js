//Pobranie loginu i pokoju z URL-a
const { login, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true
});

const socket = io();

socket.emit('joinRoom', { login, room });

const chatForm = document.getElementById('chat-form')

socket.on('message', object => {
	showMessage(object)
});

//Wysyłanie wiadomości
chatForm.addEventListener('submit', (event) => {
	event.preventDefault();

	const message = event.target.elements.message.value;
	//Pokazanie wszystkim wiadomości
	socket.emit('chatMessage', message)
	
})

    const messages = document.querySelector('#messages');
    const messageBox = document.querySelector('#message');


    
    const  showMessage = (object) => {
      messages.textContent += `${object.login}\n\n${object.message}\n`;
      messages.scrollTop = messages.scrollHeight;
      messageBox.value = '';
    } 
