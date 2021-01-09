const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt=require('bcryptjs')
const jwt = require ('jsonwebtoken')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true,
    },
    email:{
        type: String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate (value){
            if(!validator.isEmail(value)){
                throw Error ('Invalid Email')
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength:7,
        trim:true,
        validate (value){
            if(value.length<8)
                throw new Error ("Password must have at least 8 characters")
        }   
    },
    cart:{
        type: Array,
        default: []
    },
    tokens: [{
        token: {
            type: String,
            required:true
        }
    }]
})

//Generate token
userSchema.methods.generateAuthToken = async function (){
    const user=this;
    const token = jwt.sign( {_id: user._id.toString()} ,process.env.JWT_SECRET,{expiresIn: '1 days'})

    user.tokens = user.tokens.concat({token})

    await user.save()

    return token
}

//Find user by email and password
userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error ('Unable to login')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if (!isMatch){
        throw new Error ('Unable to login')
    }

    return user;
}

//Hash the password string before saving
userSchema.pre('save',async function(next){
    const user=this;

    // Returns true if password field changed (modified)
    if(user.isModified('password'))
        user.password=await bcrypt.hash(user.password,8)
    
    next()
})


const User= mongoose.model('User',userSchema);

module.exports = User;