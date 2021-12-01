const baza_danych = { 
    "users": [
        { "login" : "login",
        "haslo": "haslo"}
    ]
}

const loginForm = document.getElementById("login-form")

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const login = event.target.elements.login.value;
    const password = event.target.elements.password.value;
    const udane = document.querySelector('#udane')

    console.log(login)

    for (i in baza_danych.users) {
        if (i.login == login) {
            if (i.haslo == password) {
                return True
            }
        }
    }
    return False
})