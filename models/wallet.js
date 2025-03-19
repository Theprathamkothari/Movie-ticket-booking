const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, default: 100 }, // Default balance
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
