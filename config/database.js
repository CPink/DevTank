if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI: 'mongodb://chance:chance@ds121248.mlab.com:21248/devtank-prod'
    }
}else{
    module.exports = {
        mongoURI: 'mongodb://localhost/devtank-dev' 
    }
}