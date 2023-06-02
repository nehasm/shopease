const mongoose = require('mongoose');

const dbConnection = CB => {
    mongoose.connect(process.env.DB_URI,{useNewUrlParser:true,
        useUnifiedTopology:true
    }).then((data) => {
        console.log(`db connected: ${data.connection.host}`)
        CB();
    })
}
module.exports = dbConnection
