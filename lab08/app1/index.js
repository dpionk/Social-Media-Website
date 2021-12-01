const express = require('express');
const app = express();
const path = require('path');

app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname+'/index.html'), path.join(__dirname+'/success.html'));
  });

  app.get('/success.html',function(req,res) {
    res.sendFile( path.join(__dirname+'/success.html'));
  });

app
    .listen(3000, function () {
    console.log('Serwer HTTP działa na porcie 3000');
});

