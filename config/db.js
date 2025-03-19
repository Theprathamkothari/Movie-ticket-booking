const mongoose = require('mongoose');

const connect = () => {
    mongoose.connect('mongodb+srv://pratham:Pratham2609@cluster0.he9oe.mongodb.net/movieBooking?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
};

module.exports = { connect };
