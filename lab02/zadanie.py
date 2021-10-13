import paramiko
ssh = paramiko.SSHClient()
file = input('Podaj nazwę pliku')

ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

ssh.connect('sigma.ug.edu.pl', username='dpionk', key_filename='~/.ssh/id_rsa')

stdin, stdout, stderr = ssh.exec_command("cat ${file}")
ssh.close()