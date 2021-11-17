const port = process.env.PORT || 3000
const http = require('http');
const fs = require('fs')

fs.readFile('./zad1.html', async function (err, html) {

    if (err) throw err;    

    await http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(port);
    console.log("Server listening at port 3000")
});

