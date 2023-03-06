const Product=require('../models/productModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors=require("../middleware/catchAsyncErrors");
const ApiFeatures = require('../utils/apiFeatures');

//Create Product
exports.createProduct=catchAsyncErrors(async(req,res,next)=>{
    
    req.body.user=req.user.id
    const product=await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    })
})

//Get All Products
exports.getAllProducts=catchAsyncErrors(async(req,res,next)=>{

    const resultPerPage=2;
    const productCount=await Product.countDocuments();

    const apiFeature=new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
    
    const products=await apiFeature.query;

    res.status(200).json({
        success:true,
        productCount,
        products,
    })

})

//Get product details

exports.getProductDetails=catchAsyncErrors(async(req,res,next)=>{

    const product=await Product.findById(req.params.id);
    
    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }

    // await product.remove();

    return res.status(200).json({
        success:true,
        product
    })

})

//Update Product - Admin

exports.updateProduct=catchAsyncErrors(async(req,res,next)=>{

    let product=Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }


    product=await Product.findByIdAndUpdate(req.params.id,req.params.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })


    res.status(200).json({
        success:true,
        product
    })

})

//Delete Product - Admin

exports.deleteProduct=catchAsyncErrors(async(req,res,next)=>{

    const product=await Product.findByIdAndDelete(req.params.id);
    
    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }


    // await product.remove();

    return res.status(200).json({
        success:true,
        message:"Product deleted successfully!"
    })
})

