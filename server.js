const app = require('./app');
const dotenv = require('dotenv');
const dbConnection = require('./config/database.js');
const { uncaughtException, unhandledRejection} = require('./utils/genericError');

uncaughtException()

//config
// dotenv.config({path:'./config/config.env'})

const server = app.listen(process.env.PORT,()=>{
    console.log("server started")
});

dbConnection(()=>{server});

unhandledRejection()