const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const {requireAuth, checkUser} = require('./middlewares/authMiddleware');
const app = express();

//Use Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

//Configure EJS
app.set('view engine', 'ejs')

//Connect to DB
const dbURI = 'mongodb+srv://test:test@123@kbc.1hu7l.mongodb.net/node-js?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(res => {
    console.log('DB Connected');
    app.listen(3000, () => console.log('App Started on Port: 3000'));
})
.catch(err => console.log(err));

//Routes
app.get('*', checkUser);
app.get('/', requireAuth, (req, res) => {
    res.render('index', {title: 'Home'})
})

app.get('/blogs', requireAuth, (req, res) => {
    res.render('blogs', {title: 'All Blogs'})
})

app.use(authRoutes);

// app.get('/set-cookie', (req, res) => {
//     // res.setHeader('Set-Cookie', 'newUser=true');
//     res.cookie('newUser', false);
//     res.cookie('isEmployee', true, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true});
//     res.send('Cookie Created');
// })

// app.get('/get-cookie', (req, res) => {
//     const cookies = req.cookies;
//     console.log(cookies);
//     res.json(cookies);
// })

app.use((req, res) => {
    res.send('Error 404')
})