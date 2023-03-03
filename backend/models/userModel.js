const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

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
        default:'user'
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

module.exports=mongoose.model("User",userSchema);