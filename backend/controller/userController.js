const User=require('../models/userModel');

const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors=require("../middleware/catchAsyncErrors");
const sendToken = require('../utils/jwtToken');
const sendEmail=require('../utils/sendEmail');
const crypto=require('crypto');


//Register a User

exports.registerUser=catchAsyncErrors(async(req,res,next)=>{

    const {name,email,password,role}=req.body;

    const user=await User.create({
        name,email,password,role,
        avatar:{
            public_id:'this is a sample Id',
            url:'profilepicUrl'
        }
    })

 sendToken(user,201,res)

}) 

//Login User
exports.loginUser=catchAsyncErrors(async(req,res,next)=>{

    const {email,password}=req.body;

    //checking if user has given both

    if(!email||!password){
        return next(new ErrorHandler("Please enter Email & password"),400);
}

const user=await User.findOne({email}).select('+password')//coz password visibility is set to false

if(!user){
    return next(new ErrorHandler('Invalid email or password',401))
}

//401-unauthorised
 

const isPasswordMatched=await user.comparePassword(password);

if(!isPasswordMatched){
    return next(new ErrorHandler("Invalid email or password",401))//if email matched but password isnt
}

sendToken(user,200,res)

})



//Logout User
exports.logout=catchAsyncErrors(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    })

    res.status(200).json({
    success:true,
    message:"Logged Out"
    })
})

//Reset Password
exports.resetPassword=catchAsyncErrors(async(req,res,next)=>{

    //Creating Token Hash
    const resetPasswordToken=crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    });

    if(!user){
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired",400));
    }

    if(req.body.password!=req.body.confirmPassword){
        return next(new ErrorHandler("Passwords do not match",400));
    }

    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();

    sendToken(user,200,res);
})


//Forgot Password

exports.forgotPassword=catchAsyncErrors(async(req,res,next)=>{

const user=await User.findOne({email:req.body.email});
console.log(user);
if(!user){
    return next(new ErrorHandler('User not found',404));
}

//Get ResetPassword Token
const resetToken=user.resetPasswordToken();

await user.save({validateBeforeSave:false})
//default: validateBeforeSave:true in Mongoose
const resetPasswordUrl=`${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

const message=`Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then please ignore it.`;

try{

await sendEmail({
email:user.email,
subject:`Ecommerce Password Recovery`,
message
})
//await means to pause the execution of the async function inside which await function is defined till the promise is resolved(whatever is written inside try)

res.status(200).json({
    success:true,
    message:`Email sent to ${user.email} successfully`
})

}catch(error){
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save({validateBeforeSave:false});

    return next(new ErrorHandler(error.message,500))
}

})


