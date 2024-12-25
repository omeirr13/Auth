require('dotenv').config();

const express = require('express');

const app = express();
const jwt = require('jsonwebtoken');


app.use(express.json());

const posts = [
    {
        username: "Omeir",
        title: "Post 1",
    },
    {
        username: "Ali",
        title: "Post 2",
    },
]
app.get('/posts', authenticateToken, async (req, res) => {
    const post = posts.find((post) => post.username === req.user.name);
    res.json(post);
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Did not send bearer token" });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Token is no longer valid!" });
        }
        req.user = user;
        next();
    });

}
const PORT = 3001;
app.listen(PORT, () => {
    console.log("App listening on ", PORT);
});