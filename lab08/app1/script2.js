const { login, haslo } = Qs.parse(location.search, {
	ignoreQueryPrefix: true
});

const baza_danych = { 
    "users": [
        { "login" : "login",
        "haslo": "haslo"}
    ]
}

udane = document.querySelector('#udane')

for (i in baza_danych.users) {
    if (i.login == login) {
        if (i.haslo == haslo) {
            udane.textContent += "Udane"
            return True
        }
    }
}
return False