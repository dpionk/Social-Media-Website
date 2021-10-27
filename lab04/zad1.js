const express = require('express')
const port = process.env.PORT || 3000

const app = express()

app.get('/', (req, res) => {
    res.send('Node.js app')
})

app.post('/', (req,res) => {
    const element = req.body.element
    res.send(`Wysłano ${element}`)
})

app.listen(port, () =>{
    console.log(`Local server listening at port ${port}`)
})