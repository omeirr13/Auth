const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'omeirsSecretKey',
    resave: false,
    saveUninitialized: false
}));

const users = [];


function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        next();
    }
    else {
        res.redirect('/login');
    }
};


app.get('/', isAuthenticated, (req, res) => {
    console.log(req.session);
    const user = users.find(u => u.id === req.session.userId);
    res.render('index.ejs', { user })
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(401).send('Invalid email or password');
    };
    const match = await bcrypt.compare(password, user.password);
    if (match) {
        req.session.userId = user.id;
        return res.redirect('/');
    } else {
        return res.status(401).send('Invalid email or password');
    }
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
})

app.get('/login', (req, res) => {
    res.render('login.ejs');
})

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword
        })
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
    console.log(users);
});

app.post('/logout', async(req, res)=>{
    req.session.destroy(err => {
        if(err){
            return res.status(500).send('Failed to log out');
        }
        else{
            res.redirect('/login');
        }
    })
})

app.listen(3000);