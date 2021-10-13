const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const {NodeSSH}=require('node-ssh');

const ssh= new NodeSSH();
let ścieżka = ''

rl.question("Podaj ścieżkę", function(ścieżkaPodana) {
        ścieżka = ścieżkaPodana
        rl.close();
});

ssh.connect({
    host: 'sigma.ug.edu.pl',
    username:'dpionk',
    privateKey: 'C:/Users/Darusia/.ssh/id_rsa'
}).then(() => {
    ssh.execCommand(`cat ${ścieżka}`).then((result) => {
        console.log(result.stdout);
    });
}).catch(err => console.log(err))