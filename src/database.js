const mongoose = require('mongoose');

//const MONGODB_URI = 'mongodb://' + process.env.APP_MONGODB_HOST + '/' + process.env.APP_MONGODB_DATABASE;
const MONGODB_URI = 'mongodb://localhost/Chat';

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})
    .then(db => console.log('Database is connected'))
    .catch(err => console.log(err));