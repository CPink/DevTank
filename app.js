
const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();

/*
Mongoose Setup
---------------------------------------------------
*/

//connect to mongoose
const mongoDb = 'mongodb://localhost/devtank-dev';
mongoose.connect(mongoDb);

//get mongoose to use the global promise library
mongoose.Promise = global.Promise;

//mongoose default connection
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDb connection error:'));
db.once('open', () => {

});

/*
Models
----------------------------------------------------
*/

//load idea model
require('./models/Idea');

const Idea = mongoose.model('ideas');

/*
Middleware
-----------------------------------------------------
*/

//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');


//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//method-override middleware
app.use(methodOverride('_method'));


/*
Routes
----------------------------------------------------------------
*/

//index route
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index',{
        title: title
    });
});

//about route
app.get('/about', (req, res) => {
    res.render('about');
});

//idea index page
app.get('/ideas', (req, res) => {
    //get all ideas from server
    Idea.find({})

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
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

//edit idea form route
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea:idea
        });
    })
    
});

//process add idea form
app.post('/ideas', (req, res) => {
    //console.log(req.body);
    let errors = [];

    if(!req.body.title){
        errors.push({ text:'Please add a title' });
    }
    if(!req.body.details){
        errors.push({ text:'Please add some details' });
    }
    if(errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }else{
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
        .save()
        .then(idea => {
            res.redirect('/ideas');
        });
    }
});

//process edit form PUT
app.put('/ideas/:id', (req, res) => {
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
            res.redirect('/ideas');
        });
    });
});

//process DELETE for idea
app.delete('/ideas/:id', (req, res) => {
    //res.send('DELETE');
    Idea.remove({_id: req.params.id})
    .then(() => {
        res.redirect('/ideas');
    })
})

const port = 5000; 

//initilize app, pass in port number with call back
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});

