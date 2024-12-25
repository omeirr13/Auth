require('dotenv').config();

const express = require('express');

const app = express();
const jwt = require('jsonwebtoken');


app.use(express.json());

let refreshTokens = [];

app.post('/token', (req, res) => {
    //we will use this refresh token and see if we already have a refresh token that exists for that.
    const { refreshToken } = req.body;//normally we store in redis cache or db
    console.log(refreshToken);
    if (!refreshToken) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) {//is this refresh token still valid, have we removed it?
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.name })//we dont need other info so just get name
        res.json({ accessToken });
    })
});

app.post('/login', (req, res) => {
    //we need to authenticate our user first..
    const { username } = req.body;
    const user = { name: username };
    //first will take our payload, which is what we want to serialize, and we want to serialize a user object
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    refreshTokens.push(refreshToken);
    res.json({ accessToken, refreshToken })
})


app.delete("/logout", (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter((tok) => tok !== token);
    res.sendStatus(204);
})
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
}
const PORT = 4000;
app.listen(PORT, () => {
    console.log("App listening on ", PORT);
});