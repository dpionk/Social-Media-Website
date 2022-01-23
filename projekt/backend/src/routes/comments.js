const express = require("express");
const client = require('../config/psqlClient');
const router = express.Router({mergeParams: true});

router.get('/', async (req, res) => {
    const comments = await client.query("SELECT * FROM post_comments ");
    return res.send(comments.rows);
});


router.get('/:idPost', async (req, res) => {
	const comments = await client.query("SELECT * FROM post_comments pc RIGHT JOIN users u ON u.user_id = pc.person_id WHERE pc.commented_post_id = $1", [req.params.idPost]);
    return res.send(comments.rows);
})

router.post('/:idPost', async (req, res) => {
	const insertedCommentRows = await client.query(
        "INSERT INTO post_comments (comment_content, commented_post_id, person_id) VALUES ($1, $2, $3) RETURNING *",
        [req.body.content, req.params.idPost, req.body.author]
      );

    const insertedComment= insertedCommentRows.rows[0];
    return res.send(insertedComment);  
});

router.put('/:id', async  (req, res) => {
	const id = req.params.id;


	console.log(req.body, id)
	const result = await client.query(`UPDATE post_comments SET comment_content = $1 WHERE comment_id = $2 `,
	
	[req.body.comment_content, id]
);
console.log(result)
	return result.rowCount > 0 ? res.send('Updated') : res.sendStatus(400);
})

router.delete('/:id', async (req,res) => {
	const id = req.params.id;
    const response = await client.query("DELETE from post_comments WHERE comment_id = $1", [id]);

    return response.rowCount > 0 ? res.sendStatus(200) : res.sendStatus(400); 
})

module.exports = router;