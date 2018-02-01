
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();

//load routes
const ideas = require('./routes/ideas');

const users = require('./routes/users');

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

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//connect-flash middleware
app.use(flash());

//connect-flash middleware
//GLOBAL VARIABLE
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

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


//use ideas route
app.use('/ideas', ideas);

//use users route
app.use('/users', users);

const port = 5000; 

//initilize app, pass in port number with call back
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});

