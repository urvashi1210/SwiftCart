const app=require('./app');

const dotenv=require('dotenv');

const connectDatabase=require('./config/database.js');

//Handling uncaught Exception
process.on('uncaughtException',(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to uncaught exception`);

    process.exit(1);
})

//Config
dotenv.config({path:'backend/config/config.env'});

//Connect Database
connectDatabase();

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is up on http://localhost:${process.env.PORT}`);
})

//Unhandled Promise Rejection-SHUT DOWN SERVER ASAP WHEN SUCH ERRORS OCCUR TO AVOID MORE MISHAPS


process.on('unhandledRejection',(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to unhandled promise reaction`);

    server.close(()=>{
        process.exit(1);//end the process while closing the server
    })
})