/* eslint-disable no-undef */
const mysql = require('mysql2')
const express = require('express');
const cors = require('cors')
const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json())

const connectWithRetry = require('./config/db');
let db
(async function makeDb() {
    console.log('Attempting to make a db connection...')
    db = await connectWithRetry();
    console.log('db connection made')
    app.listen(PORT, () => {
        console.log(`API Server is running`)
    })
})();


// Route to get all posts
app.get("/api", (req, res) => {
    db.query("SELECT * FROM posts", (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send({ error: 'Database error', details: err });
        }
        res.send(result)
    }
    );
});

// Route to get one post
app.get("/api/:id", (req, res) => {

    const id = req.params.id;
    db.query("SELECT * FROM posts WHERE id = ?", id, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send({ error: 'Database error', details: err });
        }
        res.send(result)
    }
    );
});

app.post('/api', (req, res) => {
    const username = req.body.userName;
    const title = req.body.title;
    const text = req.body.text;
    db.query("INSERT INTO posts (title, post_text, user_name) VALUES (?, ?, ?)", [title, text, username], (err, result) => {
        if (err) {
            return res.status(500).send({ error: 'Database error', details: err });
        }
        // Retrieve the last inserted post
        db.query("SELECT * FROM posts WHERE id = LAST_INSERT_ID()", (err, rows) => {
            if (err) {
                return res.status(500).send({ error: 'Error fetching the created post', details: err });
            }
            res.status(201).send(rows[0]);
        });
    });

    // Route for like
    app.post('/api/like/:id', (req, res) => {
        const id = req.params.id;
        db.query("UPDATE posts SET likes = likes + 1 WHERE id = ?", id, (err, result) => {
            if (err) {
                return res.status(500).send({ error: 'Could no update the post', details: err });
            }
            res.status(200).send();
        });
    });
})

// Route to delete a post
app.delete('/api/:id', (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM posts WHERE id= ?", id, (err, result) => {
        if (err) {
            return res.status(500).send({ error: 'Could no update the post', details: err });
        }
    })
    res.status(200).send();
})


