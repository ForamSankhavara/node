const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    fname:{
        type:String,
        required:[true,"fname is required"],
        minlength:3
    },
    lname:{
        type:String,
        required: [true,"lname is required"],
        minlength:3
    },
    email:{
        type:String,
        required: [true,"email is required"],
        unique: [true,"email is already exiest"],
        validator(value){
            if(!validator.isEmail(value)){
                throw new error("invalid email")
            }
        }
    },
    contact:{
        type:String,
        required: [true,'contact is required'],
        minlength: 10,
        maxlength: 10
    },
    hash_password:{
        type:String,
        required: [true,'password is required'],
        minlength:3
    },
    isVarified:{
        type:String,
        default:0
    }
})

userSchema.virtual('password')
.set(function(password){
    this.hash_password = bcrypt.hashSync(password,10)
})
module.exports = mongoose.model('User',userSchema)

