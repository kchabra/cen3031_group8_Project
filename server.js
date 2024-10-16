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
app.post('/signup', (req, res) => {
    console.log("Received request for signup:", req.body);
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }
    User.findOne({ email: email }).then(user => {
        if (user) {
            res.status(400).json({ error: "User with this email already exists." });
        }
        else {
            const newUser = new User({
                email,
                username,
                password,
            });
            newUser.save().then((result) => res.status(201).json(result)).catch((err) => {
                console.error("Error saving user:", err);
                res.status(500).json({ error: "Failed to create user."});
            });
        }
    }).catch((err) => res.status(500).json({ error: "Error checking existing user." }));
});
app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);});
