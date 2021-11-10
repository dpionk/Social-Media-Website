const express = require('express')
const port = process.env.PORT || 3000
const app = express()
app.use(express.json())

app.listen(port, () =>{
    console.log(`Local server listening at port ${port}`)
})

const checkCols = (board) => {
    if (board[0] === board[3] && board[0] === board[6]) {
        return board[0]
    }
    if (board[1] === board[4] && board[1] === board[7]) {
        return board[1]
    }
    if (board[2] === board[5] && board[2] === board[8]) {
        return board[2]
    }
    else {
        return board;
    }
}

const checkRows = (board) => {
    if (board[0] === board[1] && board[0] === board[2] ) {
        return board[0]
    }
    if (board[3] === board[4] && board[3] === board[5]) {
        return board[3]
    }
    if (board[6] === board[7] && board[6] === board[8]) {
        return board[6]
    }
    else {
        return board
    }
}

const checkCross = (board) => {
    if (board[0] === board[4] && board[0] === board[8]) {
        return board[0]
    }
    if (board[2] === board[4] && board[2] === board[7]) {
        return board[2]
    }
    else {
        return board
    }
}

const fullBoard = (board) => {
    if (board.indexOf(null) === -1) {
        return true;
    }
    return false;
}


const games = { "games" : [
    {"id":"1","status":"in_progress","player":{"name":"Daria"},"board":[null,null,null,null,null,null,null,null,null],"winner":null},
    {
        "id": "2",
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
    
    const game = games.games.filter((element) => {
        return element.id === req.params.id
    })

    res.json(game);
})

app.post("/games/:id",(req, res) => {
    if (games.games.filter(element => {return element.id === req.params.id})[0].status === "in_progress")    {
    games.games.map((element) => {
        if (element.id === req.params.id) {
            if (element.board[req.body.index] === null) {
            newElement = element
            newElement.board[req.body.index] = "X"
            return newElement
            }
            else {
                res.send("Pole już zajęte")
                return element
            }
        }
        else {
            return element
        }
    })

    const board = games.games.filter((element) => {
        return element.id === req.params.id
    })[0].board

    if (checkCols(board) === "X" || checkCross(board) === "X"|| checkRows(board) === "X") {

        games.games.map((element) => {
            if (element.id === req.params.id) {
                const nowyElement = element
                nowyElement.winner = element.player.name
                nowyElement.status = "done"
                return nowyElement
                }
            else {
                return element
            }
        })

        res.send("Wygrał gracz X")
    }

    if (checkCols(board)=== "O" || checkCross(board)=== "O" || checkRows(board) === "O") {
        games.games.map((element) => {
            if (element.id === req.params.id) {
                const nowyElement = element
                nowyElement.winner = "computer"
                nowyElement.status = "done"
                return nowyElement
                }
            else {
                return element
            }
        })
        res.send("Wygrał komputer")
    }

    if (fullBoard(board)) {
        games.games.map((element) => {
            if (element.id === req.params.id) {
                const nowyElement = element
                nowyElement.status = "done"
                return nowyElement
                }
            else {
                return element
            }
        })
        res.send("Koniec rozgrywki. Nikt nie wygrał.")
    }

    else {
        games.games.map((element) => {
            if (element.id === req.params.id) {
                const nowyElement = element
                nowyElement.board[nowyElement.board.indexOf(null)] = "O"
                return nowyElement
                }
            else {
                return element
            }
        })

        
    }


    newBoard = games.games.filter((element) => {
        return element.id === req.params.id
    })[0].board

    if (checkCols(newBoard) || checkCross(newBoard) || checkRows(newBoard) === "X") {

        games.games.map((element) => {
            if (element.id === req.params.id) {
                const nowyElement = element
                nowyElement.winner = element.player.name
                nowyElement.status = "done"
                return nowyElement
                }
            else {
                return element
            }
        })
        res.send("Wygrał gracz X")
    
    }

    if (checkCols(newBoard) || checkCross(newBoard) || checkRows(newBoard) === "O") {

        games.games.map((element) => {
            if (element.id === req.params.id) {
                const nowyElement = element
                nowyElement.winner = "computer"
                nowyElement.status = "done"
                return nowyElement
                }
            else {
                return element
            }
        })

        res.send("Wygrał komputer")

    }
    
    const game = games.games.filter((element) => {
        return element.id === req.params.id
    })

    res.json(game);
}
    else {
        res.send("Gra już zakończona")
    }

})
