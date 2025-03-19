const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Movie = require('../models/index');
const Seat = require('../models/seat');
const Wallet = require('../models/wallet');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Mock user data (replace with database logic)
let users = [];

// Add a test user for login
users.push({ username: 'testuser', password: bcrypt.hashSync('password123', 10) });

// Temporarily bypass authentication for development
router.use((req, res, next) => {
    console.log('Bypassing authentication for development');
    next();
});

// User Registration
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt for user:', username);
    try {
        const user = await User.findOne({ username });
        console.log('User found:', user);
        if (user) {
            const isValidPassword = await bcrypt.compare(password, user.password);
            console.log('Password valid:', isValidPassword);
            if (isValidPassword) {
                const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' }); // Use environment variable for secret
                res.json({ token });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Error logging in user', error });
    }
});

// Fetch all movies
router.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movies', error });
    }
});

// Fetch available seats for a specific movie
router.get('/seats/:movieId', async (req, res) => {
    try {
        const seats = await Seat.find({ movieId: req.params.movieId });
        res.json(seats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching seats', error });
    }
});

// Book a seat
router.post('/book-seat', async (req, res) => {
    const { movieId, seatNumber } = req.body;
    try {
        const seat = await Seat.findOne({ movieId, seatNumber });
        if (seat.isBooked) {
            return res.status(400).json({ message: 'Seat already booked' });
        }
        seat.isBooked = true;
        await seat.save();
        res.json({ message: 'Seat booked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error booking seat', error });
    }
});

// Deduct ticket price from wallet
router.post('/purchase-ticket', async (req, res) => {
    const { userId, ticketPrice } = req.body;
    try {
        const wallet = await Wallet.findOne({ userId });
        if (wallet.balance < ticketPrice) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        wallet.balance -= ticketPrice;
        await wallet.save();
        res.json({ message: 'Ticket purchased successfully', balance: wallet.balance });
    } catch (error) {
        res.status(500).json({ message: 'Error purchasing ticket', error });
    }
});

// Confirmation route
router.post('/confirm-booking', async (req, res) => {
    const { userId, movieId, seatNumber } = req.body;
    try {
        const seat = await Seat.findOne({ movieId, seatNumber });
        const wallet = await Wallet.findOne({ userId });
        if (!seat || !wallet) {
            return res.status(404).json({ message: 'Booking details not found' });
        }
        res.json({
            message: 'Booking confirmed',
            bookingDetails: {
                movieId,
                seatNumber,
                walletBalance: wallet.balance
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error confirming booking', error });
    }
});

module.exports = router;
