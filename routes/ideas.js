
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

module.exports = router;

//load idea model
require('../models/Idea');

const Idea = mongoose.model('ideas');

//idea index page
router.get('/', ensureAuthenticated, (req, res) => {
    //get all ideas from server
    Idea.find({user: req.user.id})

    //sort ideas that are rendered by date
    .sort({date: 'desc'})

    .then(ideas => {
        //render ideas from server to ideas/index
    res.render('ideas/index', {
        ideas: ideas
    });
    })
})

//add idea form route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

//edit idea form route GET
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        if(idea.user != req.user.id){
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/ideas');
        }else{
            res.render('ideas/edit', {
                idea:idea
            });
        }
        
    })
    
});

//process POST idea form
router.post('/', ensureAuthenticated, (req, res) => {
    //console.log(req.body);
    let errors = [];

    if(!req.body.title){
        errors.push({ text:'Please add a title' });
    }
    if(!req.body.details){
        errors.push({ text:'Please add some details' });
    }
    if(errors.length > 0){
        res.render('/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }else{
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newUser)
        .save()
        .then(idea => {
            req.flash('success_msg', 'App Idea was Added');
            res.redirect('/ideas');
        });
    }
});

//process edit form PUT
router.put('/:id', ensureAuthenticated, (req, res) => {
    //res.send('PUT');
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea => {
            req.flash('success_msg', 'App Idea was Updated');
            res.redirect('/ideas');
        });
    });
});

//process DELETE for idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    //res.send('DELETE');
    Idea.remove({_id: req.params.id})
    .then(() => {
        req.flash('success_msg', 'App Idea was removed');
        res.redirect('/');
    });
});
