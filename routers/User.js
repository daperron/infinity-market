const express = require('express')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const session = require('express-session')
const MongoStore = require('connect-mongo')
//url to connect to our database
const url = 'mongodb+srv://daperron:TtxPIL6S3Krpk7pf@cluster0.aqtol.mongodb.net/infinity-market?retryWrites=true"'

const router = new express.Router()
router.use(express.json()) 
router.use(session({
    secret : "topsecretkey",
    resave: false,
    saveUninitialized : false,
    store : MongoStore.create({mongoUrl : url})
}))

//creates a new user in the User collection
router.post('/users/register', async(req,res)=>{

    console.log(req.body)
    //const user = new User({...req.body})
    const user = new User({...req.body})
    try{
        user.password = await bcrypt.hash(user.password,8) //hashes the password the user entered
        const u = await user.save()
        //store the session 
        req.session.user_id = u._id
        console.log("u " + u)
        res.redirect('/dashboard')

    }catch(e){
        console.log("catch e" + e)
        res.redirect('/')
    }
    /*
    user.save((error,result)=>{
        if(error)
            res.send('/')
        else
            res.send(result)
            res.redirect('/dashboard')
    })
    */
})

//TODO
router.post('/users/login',async(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;

    const user = await User.findOne({user_name:username})
    //check if user entered the correct password
    //if(!user){
    //    console.log("user not found")
    //    res.redirect('/')
    //}else{
        //check if password matches hashed value
    //    const isMatch = bcrypt.compare(password,user.password)
       //check if true then open dahsboard route else redirect to root page
    //    if(isMatch){
            //check if session id is equal to users id
     //       req.session.user_id = user._id
      //      console.log("password found")
      //      res.send('/dashboard')
      //  }
      //  else{
       //     console.log("password was incorrect")
       //     res.redirect('/')
      //  }
   // }

})


router.get('/dashboard',async (req,res)=>{
    req.session.fruit = "fruit"
    console.log(req.session)
    //if the user has the correct session id, allow them to render dashboard.ejs
    if(req.session.user_id){
        const user = await User.findById(req.session.user_id)
        res.render('dashboard.ejs',{user_name:user.user_name})
    }
    else{
        res.redirect('/')
    }
    
})



//return a single user’s details along with their items when a request is made with the user_name passed in the url as a dynamic parameter
router.get('/users/:me',async(req,res)=>{
    User.find({user_name : req.params.user_name },(error,result)=>{
        if(error)
            res.send({error: 'Error, unable to process your request'})
        else
            res.send(result)
    })

})

//This route will respond to a delete request by deleting the user, whose user_name was passed in the url as a dynamic parameter.
router.delete('/users/:user_name', (req,res)=>{
    User.deleteOne({user_name : req.params.user_name},(error, result)=>{
        if(error)
            res.send({error: error})
        else
            console.log(result)
    })
})

router.use((req,res,next)=>{

})

function authenticateUser(req,res,next){
    if(req.session.user_id){
        //forword the user if user_id is present
        next() 
    }else{
        res.send({"message": "this page is requires you to be logged in"})
    }
}




module.exports = router