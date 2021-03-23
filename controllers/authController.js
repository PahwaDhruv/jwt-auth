const User = require('../models/user');
const jwt = require('jsonwebtoken');

const handleError = (err) => {
    console.log(err.message, err.code);
    let errors = {
        email : '',
        password : ''
    }

    //Incorrect Email
    if(err.message === 'Incorrect Email'){
        errors.email = 'Incorrect Email';
    }
    //Incorrect Password
    if(err.message === 'Incorrect Password'){
        errors.password = 'Incorrect Password';
    }

    if(err.code === 11000){
        errors.email = 'This email already exists';
        return errors;
    }
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

//time in seconds unlike cookie where it is miliseconds
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'dev central', {
        expiresIn : maxAge 
    })
}
const register_get = (req, res) => {
    res.render('register', {title: 'Register'});
}

const register_post = (req, res) => {
    console.log(req.body);
    const newUser = new User(req.body);
    newUser.save()
    .then(user => {
        console.log('result', user);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({user: user._id});
    })
    .catch(err => {
        const errors = handleError(err);
        res.status(400).json({errors});
    });
    
}

const login_get = (req, res) => {
    
    res.render('login', {title: 'Login'});
}

const login_post = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({user: user._id});
    }
    catch(err){
        const errors = handleError(err);
        res.status(400).json({errors}); 
    }
}

const logout_get = (req, res) => {
    res.cookie('jwt','', {maxAge: 1});
    res.redirect('/');
}

module.exports = {
    register_get,
    register_post,
    login_get,
    login_post,
    logout_get
}