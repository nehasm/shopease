const express = require('express');
const cookieParser = require('cookie-parser');
var cors = require('cors');
const dotenv = require("dotenv")

const app = express();

const product = require('./routes/product');
const user = require('./routes/user');
const order = require('./routes/order');
const cart = require('./routes/cart');
const payment = require('./routes/payment');
const errorMiddleware = require('./middleware/error');

// dotenv.config({ path: "./config/config.env" });

//bodyparser
const corsOptions = {
    origin:'https://main--frabjous-centaur-847b52.netlify.app', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())

//routes
app.use("/api/v1",product);
app.use("/api/v1",user);
app.use('/api/v1',order);
app.use('/api/v1',cart
);
app.use('/api/v1',payment)
//error middleware
app.use(errorMiddleware)


module.exports = app;