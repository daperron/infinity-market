const express = require('express')
const Product = require('../models/Product')
const User = require('../models/User')

const router = new express.Router()

//This route will respond to a post request by creating a new product on the Product collection
router.post('/products',(req,res)=>{
    User.findOne(req.params._id).populate('items').exec((error, entry) =>{
        console.log("Here below is entry.items")
        console.log(entry.items)
    }),
    console.log(req.body)
    const product = new Product({...req.body})
    product.save((error,result)=>{
        if(error){
            res.send({error: error})
            //console.log("error" + result.items)
        }
        else{
            res.send(result)
            console.log(result.items)
            
            
        }
    })
})



module.exports = router