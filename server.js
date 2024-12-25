const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./passport-config');
const flash = require('express-flash');

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

const app = express();
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: 'omeirsSecretKey',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


const users = [];

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { user: { name: req.user.name } })
});
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
})
app.get('/register', (req, res) => {
    res.render('register.ejs');
})

app.post('/login', passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));
app.post('/register', checkNotAuthenticated, async (req, res) => {
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
app.delete('/logout', async (req, res) => {
    req.logOut();
    return res.redirect('/login');
})


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

app.listen(3000);