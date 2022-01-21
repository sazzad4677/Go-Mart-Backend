const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((con) => {
        console.log(`Mongodb connected with Host:${con.connection.host}`)
    }).catch((error) => {
        console.log(error);
    })
}

module.exports = connectDatabase;