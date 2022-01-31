const express = require("express");
const client = require('../config/psqlClient');
const router = express.Router({mergeParams: true});

router.get('/', async (req, res) => {
    const posts = await client.query("SELECT * FROM post p LEFT JOIN users u ON u.user_id = p.creator");
    return res.send(posts.rows);
});

router.post('/', async (req, res) => {
	const postToAdd = req.body
	const insertedPostRows = await client.query(
        "INSERT INTO post ( title, post_creation_date, post_content, creator) VALUES ($1, $2, $3, $4) RETURNING *",
        [postToAdd.title, postToAdd.release_date, postToAdd.post_content, postToAdd.creator]
      );

    const insertedPost = insertedPostRows.rows[0];
    return res.send(insertedPost);  
})


router.get('/:id', async (req,res) => {

	const posts = await client.query("SELECT * FROM post p LEFT JOIN users u ON u.user_id = p.creator WHERE p.post_id = $1", [parseInt(req.params.id)])
	return res.send(posts.rows)
})


router.get('/author/:id', async (req,res) => {
	const posts = await client.query("SELECT * FROM post WHERE creator = $1", [parseInt(req.params.id)])
	return res.send(posts.rows)
})

router.put('/:id', async  (req, res) => {
	const id = req.params.id;

	const result = await client.query(`UPDATE post SET title = $1, post_content = $2 WHERE post_id = $3`,
	[req.body.title, req.body.post_content, id]
);

	return result.rowCount > 0 ? res.send('Updated') : res.sendStatus(400);
})


router.delete('/:id', async (req,res) => {
	const id = req.params.id;
	await client.query("DELETE from reactions WHERE reaction_post_id = $1", [id]);
	await client.query("DELETE from post_comments WHERE commented_post_id = $1", [id]);
    const response = await client.query("DELETE from post WHERE post_id = $1", [id]);

    return response.rowCount > 0 ? res.sendStatus(200) : res.sendStatus(400); 
})
module.exports = router;