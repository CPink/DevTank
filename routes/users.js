const express = require('express');
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