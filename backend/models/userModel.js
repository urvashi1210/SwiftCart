const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')

const userSchema=new mongoose.Schema({
    name:{
     type:String,
        required:[true,'Please enter your name'],
        maxlength:[30,'Name cannot exceed 30 characters'],
        minlength:[4,'A name should be more than 4 characters']
    }, 
    email:{
        type:String,
        required:[true,'Please enter your email'],
        unique:true,
        validate:[validator.isEmail,'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true,'Please enter your password'],
        minlength:[4,'A name should be more than 8 characters'],
        select:false,
    },
    avatar:{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
    },
    role:{
        type:String,
        default:'user',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
resetPasswordToken:String,
resetPasswordExpire:Date,
});

userSchema.pre('save',async function(next){

    //In case of update, if password hasnt been modified in updation then no need to hash the hashed password

    if(!this.isModified('password')){
      next();  
    }
    this.password=await bcrypt.hash(this.password,10);
})

//JWT TOKEN
userSchema.methods.getJWTToken=function(){
return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE,
    })
}//HAS BECOME A METHOD OF USER SCHEMA

//Compare Password
userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}

//Generating Password Reset Token
userSchema.methods.getResetPasswordToken=async function(){

//Generating token
const resetToken=crypto.randomBytes(20).toString("hex");

//Hashing via sha algo and add resetPasswordToken to UserSchema
this.resetPasswordToken=crypto
.createHash("sha256")
.update(resetToken)
.digest("hex");

this.resetPasswordExpire=Date.now()+45*60*1000;

return resetToken;
};

module.exports=mongoose.model("User",userSchema);