import pysftp

komenda = input("Jaką komendę wybierasz? POBIERZ lub WYŚLIJ")

if komenda != "POBIERZ" and komenda != "WYŚŁIJ":
    print("Błędna komenda")
if komenda == "POBIERZ":
    sciezka = input("Podaj ścieżkę do pliku z serwera zdalnego")
    haslo = input("Podaj swoje hasło do serwera zdalnego")
    with pysftp.Connection("sigma.ug.edu.pl", username="dpionk", password=haslo) as sftp:
        sftp.get(sciezka)
else: 
    sciezka = input("Podaj ścieżkę do pliku lokalnego")
    haslo = input("Podaj swoje hasło do serwera zdalnego")
    with pysftp.Connection("sigma.ug.edu.pl", username = "dpionk", password="haslo") as sftp:
        sftp.put(sciezka)
print("Gotowe :)")