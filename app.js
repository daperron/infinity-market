const express = require('express') //imports express
const path =require('path') //imports path utils
const Product =require('./models/Product.js');
const User = require('./models/User.js');
const mongoose = require('mongoose')
const userRouter = require('./routers/User.js')
const productRouter = require('./routers/Product.js')

//mongoose connection to database
const url = 'mongodb+srv://daperron:TtxPIL6S3Krpk7pf@cluster0.aqtol.mongodb.net/infinity-market?retryWrites=true&w=majority"'
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})



//add other imports here

const app = express(); //creates express application and returns an object
const port=3000; //selects the port to be used
app.listen(port) // starts listening for client requests on specified port
console.log("Server is starting...")


app.use(express.static('./public')) //points to static resources like css, client side js etc.
app.set('view engine','ejs') //tells express top use  EJS templating engine
app.set('views',path.join(__dirname,'/views')) //sets the apps view directory 
app.use(express.json());// used to recognize the incoming request object as a json object
app.use(express.static(path.join(__dirname, 'public')))
app.use(userRouter)
app.use(productRouter)

/* GET index listing. */
app.get('/', (req, res)=> {
    res.render('index.ejs');
});



