const express = require("express");
const client = require('../config/psqlClient');
const router = express.Router({mergeParams: true});

router.get('/', async (req, res) => {
    const comments = await client.query("SELECT * FROM reactions");
    return res.send(comments.rows);
});


router.get('/:idPost', async (req, res) => {
	const comments = await client.query("SELECT * FROM reactions pc RIGHT JOIN users u ON u.user_id = pc.reaction_user_id WHERE pc.reaction_post_id = $1", [req.params.idPost]);
    return res.send(comments.rows);
})

router.post('/:idPost', async (req, res) => {
	console.log(req.body)
	const insertedCommentRows = await client.query(
        "INSERT INTO reactions (reaction_post_id, reaction_user_id, reaction_type) VALUES ($1, $2, $3) RETURNING *",
        [req.params.idPost, req.body.author, req.body.type]
      );

    const insertedComment= insertedCommentRows.rows[0];
    return res.send(insertedComment);  
});

router.put('/:id', async  (req, res) => {
	const id = req.params.id;


	const result = await client.query(`UPDATE reactions SET reaction_type = $1 WHERE reaction_post_id = $2 AND reaction_user_id = $3 `,
	
	[req.body.type, id, req.body.author]
);
	return result.rowCount > 0 ? res.send('Updated') : res.sendStatus(400);
})

router.delete('/:idPost', async (req,res) => {
	const id = req.params.idPost;
    const response = await client.query("DELETE from reactions WHERE reaction_post_id = $1 AND reaction_user_id = $2", [id, req.body.author]);

    return response.rowCount > 0 ? res.sendStatus(200) : res.sendStatus(400); 
})


module.exports = router;