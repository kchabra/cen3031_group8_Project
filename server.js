const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./users');
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

//MongoDB Connect
const dbURI = "mongodb+srv://BryanG156:Brohood156@cen3031budgetbuddy.kumw8.mongodb.net/?retryWrites=true&w=majority&appName=CEN3031BudgetBuddy"
mongoose.connect(dbURI)
    .then((result) => console.log("Connected to DB"))
    .catch((err)=> console.log(err));

app.get('/', (req, res) => {res.send("Welcome to the project!");});
const bcrypt = require('bcrypt');
const salt_rounds = 10;
app.post('/signup', (req, res) => {
    console.log("Received request for signup:", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }
    User.findOne({ email: email }).then(user => {
        if (user) {
            res.status(400).json({ error: "User with this email already exists." });
        }
        else {
            bcrypt.hash(password, salt_rounds, (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: "Failed to hash password." });
                }
                const newUser = new User({
                    email,
                    password: hash
                });
                newUser.save().then((result) => res.status(201).json(result)).catch((err) => {
                    console.error("Error saving user:", err);
                    res.status(500).json({ error: "Failed to create user."});
                });
                });
            }
    }).catch((err) => res.status(500).json({ error: "Error checking existing user." }));
});
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.post('/login', (req, res) => {
    const { email, password, rememberMe } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(400).json({ error: "User with this email does not exist." });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Password comparison error." });
            }
            if (result) {
                const session_options = {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production'
                };
                if (rememberMe) {
                    session_options.maxAge = 14 * 24 * 60 * 60 * 1000;
                }
                res.cookie('user_email', email, session_options);
                res.status(200).json({ message: "Login successful" });
            }
            else {
                res.status(400).json({ error: "Invalid email or password." });
            }
        });
}).catch((err) => {
    console.error("Error finding user:", err);
    res.status(500).json({ error: "Server error" });
});
});
app.get('/profile', (req, res) => {
    const user_email = req.cookies.userEmail;
    if (!user_email) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    user.findOne({email: user_email}).then(user => {
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ profile: user.profile });
    }).catch(err => {
        res.status(500).json({ message: 'Error fetching profile', err });
    });
});
app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);});
