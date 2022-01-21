const express = require("express");
const client = require('../config/psqlClient');
const router = express.Router({mergeParams: true});


router.get('/', async (req, res) => {
    const posts = await client.query("SELECT * FROM post");
    return res.send(posts.rows);
});

router.post('/', async (req, res) => {
	const postToAdd = req.body
	const insertedPostRows = await client.query(
        "INSERT INTO post (title, release_date, post_content, creator) VALUES ($1, $2, $3, $4) RETURNING *",
        [postToAdd.title, postToAdd.release_date, postToAdd.post_content, postToAdd.creator]
      );

    const insertedPost = insertedPostRows.rows[0];
    return res.send(insertedPost);  
})

router.get('/:id', async (req,res) => {
	const posts = await client.query("SELECT * FROM post WHERE creator = $1", [parseInt(req.params.id)])
	return res.send(posts.rows)
})

module.exports = router;