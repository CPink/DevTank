const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

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

const port = 5000; 

//initilize app, pass in port number with call back
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});

