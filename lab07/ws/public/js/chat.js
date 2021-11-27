const socket = io();

//function () {
//    const sendBtn = document.querySelector('#send');
//    const messages = document.querySelector('#messages');
//    const messageBox = document.querySelector('#messageBox');

//    let ws;
    
//    function showMessage(login, message) {
//      messages.textContent += `${login}\n\n${message}\n`;
//      messages.scrollTop = messages.scrollHeight;
//      messageBox.value = '';
//    } 
    
//    let login= prompt("Podaj swój login");

//    if (login == null || login == "") {
//      showMessage("bot", "Połączenie nieudane, ponieważ musisz podać login. Odśwież stronę.")
//    }

//    else {
//    function init() {
//      if (ws) {
//        ws.onerror = ws.onopen = ws.onclose = null;
//        ws.close();
//      }

//      ws = new WebSocket('ws://localhost:3000');
//      ws.onopen = () => {
//        showMessage("bot", "Połączenie udane, możesz zacząć pisać\n")
//      }
//      ws.onmessage = ({ data }) => showMessage(login,data);
//      ws.onclose = function() {
//        ws = null;
//      }
//    }

//    sendBtn.onclick = function() {
//      if (!ws) {
//        showMessage("Brak połączenia");
//        return ;
//      }

//      ws.send(messageBox.value);
//      showMessage(login,messageBox.value);
//    }

//    init();
//  }
//};
  