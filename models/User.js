const mongoose = require('mongoose');
const Product = require('./Product');
const Schema = mongoose.Schema

const UserSchema = new Schema ({
    name:{
        type : String,
        required : true,
    },
    user_name:{
        type : String,
        required : true,
        unique : true //unique value for a given path
    },
    balance:{
        type : Number,
        default : 100
    },
    password:{
        type : String,
        required : true
    }
    
});
UserSchema.virtual('items',{
    ref: 'Product',
    localField:'_id',
    foreignField:'name'

})

UserSchema.set('toJSON',{virtuals: true})

UserSchema.pre('save',function(next){
    console.log("User is being created...")
    next()
})

//delete all entries that match the username
UserSchema.pre('deleteOne',{document: true}, function(next){
    Product.deleteMany({user_name: this._id},(error, result)=>{
        next()
    })
    
})
UserSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User',UserSchema);
module.exports = User;