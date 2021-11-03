const express = require('express')
const port = process.env.PORT || 3000
const app = express()
app.use(express.json())

app.listen(port, () =>{
    console.log(`Local server listening at port ${port}`)
})

const games = { "games" : [
    {"id":"d7348564-03ca-4723-8994-f78d25615530","status":"in_progress","player":{"name":"Daria"},"board":[null,null,null,null,null,null,null,null,null],"winner":null},
    {
        "id": "e7f807c9-7450-4744-9173-164978334f9f",
        "status": "in_progress",
        "player": {
        "name": "Player"
        },
        "board": [
          null, null,null,
          null,null,null,
          null,null,null
        ],
        "winner": null
        }] }

app.get('/games', (req,res) => {
    res.json(games) 
})

app.post('/games', (req,res) => {
    const game = {
        "id": req.body.id,
          "status": "in_progress",
          "player":
            {
              "name": req.body.player
            },
          "board": [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "winner": null
        }
     games.games.push(game)
     res.json({requestBody: game}) 
})

app.get("/games/:id",(req, res) => {
    
    res.json(games.games.filter((element) => {
        element.id == req.params.id
    }));
})

app.post("/games/:id",(req, res) => {

    games.games.map((element) => {
        if (element.id == req.params.id) {
            if (element.board[req.params.indeks] == null) {
            newElement = element
            newElement.board[req.body.index] = "X"
            return newElement
            }
            else {
                console.log("Pole już jest zajęte!")
                return element
            }
        }
        else {
            return element
        }
    })
    
    res.json(games.games.filter((element) => {
        element.id == req.params.id
    }));
})
