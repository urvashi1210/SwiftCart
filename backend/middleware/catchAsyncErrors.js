module.exports=theFunc=>(req,res,next)=>{
    Promise.resolve(theFunc(req,res,next)).catch(next);
//Promise is js class
//resolve() is its method
//passing same func means try(that func)
}