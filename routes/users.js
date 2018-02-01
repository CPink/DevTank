const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

module.exports = router;


//user login route
router.get('/login', (req, res) => {
    //res.send('login');
    res.render('users/login');
});

//user register route
router.get('/register', (req, res) => {
    //res.send('register');
    res.render('users/register');
});

//register form POST
router.post('/register', (req, res) => {
    let errors = [];

    if(req.body.password != req.body.password2){
        errors.push({text: 'Passwords must match'})
    }

    if(req.body.password.length < 4){
        errors.push({text: 'Password must be atleast 4 characters'})
    }

    if(errors.length > 0){
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });       
    }else{
        res.send('passed')
    }
});