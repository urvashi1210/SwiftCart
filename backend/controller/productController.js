const Product=require('../models/productModel');
const ErrorHandler = require('../utils/errorhandler');


//Create Product
exports.createProduct=async(req,res,next)=>{
    
    const product=await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    })
}

//Get All Product
exports.getAllProducts=async(req,res,next)=>{

    const products=await Product.find();

    if(!products){
        return next(new ErrorHandler("Products not found",404))
    }


    res.status(200).json({
        message:"Route is working fine"
    })

}

//Get product details

exports.getProductDetails=async(req,res,next)=>{

    const product=await Product.findById(req.params.id);
    
    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }

    // await product.remove();

    return res.status(200).json({
        success:true,
        product
    })

}

//Update Product - Admin

exports.updateProduct=async(req,res,next)=>{

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

}

//Delete Product - Admin

exports.deleteProduct=async(req,res,next)=>{

    const product=await Product.findByIdAndDelete(req.params.id);
    
    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }


    // await product.remove();

    return res.status(200).json({
        success:true,
        message:"Product deleted successfully!"
    })
}
