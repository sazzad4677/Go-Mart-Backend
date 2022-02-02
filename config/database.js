const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.NODE_ENV === 'PRODUCTION'? process.env.DB_URI : process.env.DB_LOCAL_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((con) => {
        console.log(`Mongodb connected with Host:${con.connection.host}`)
    })
}

module.exports = connectDatabase;