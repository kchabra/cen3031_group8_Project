const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cors_options = {
    origin: 'http://localhost:3000',
    credentials: true,
};
const User = require('./users');
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors(cors_options));
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
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict'//Prevents cookies from being sent from different websites.
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
    const user_email = req.cookies.user_email;
    if (!user_email) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    User.findOne({email: user_email}).select('email profile').then(user => {
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ profile: user.profile });
    }).catch(err => {
        res.status(500).json({ message: 'Error fetching profile', err });
    });
});

app.post('/onboarding', (req, res) => {
    const {first_name, last_name, balances, budget} = req.body;
    const user_email = req.cookies.user_email;
    if (!user_email) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    User.findOneAndUpdate({email: user_email}, {
        profile: {
            first_name,
            last_name,
            balances: {
                balance_type: "Main Balance",
                amount: balances.amount
            },
            budget: {
                amount: budget.amount,
                last_set: Date.now()
            }
        }
    }, {new: true}).then((updated_user) => {
        if (!updated_user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Profile updated successfully' });
    }).catch(err => {
        res.status(500).json({ message: 'Error updating profile', err });
    });
});
app.post('/add-expense', (req, res) => {
    const {category, description, amount} = req.body;
    const user_email = req.cookies.user_email;
    if (amount < 1) {
        return res.status(400).json({ error: "Amount must be greater than or equal to 1." });
    }
    if (!user_email) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    User.findOneAndUpdate({email: user_email, "profile.balances.balance_type": "Main Balance"}, {
        $push: {
            "profile.expenses": {
                category,
                amount,
                date: Date.now(),
                description,
            }
        }, 
        $inc: {
            "profile.balances.$.amount": -amount,
            "profile.budget.amount": -amount
        }
    }, {new: true}).then((updated_user) => {
        if (!updated_user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'Expense added successfully!' });
    }).catch (error => {
        console.error(error);
        res.status(500).json({ message: 'Error adding expense', error });
    });
});
app.post("/update-balance", (req, res) => {
    const {balance_type, category, description, amount} = req.body;
    user_email = req.cookies.user_email;
    if (amount < 1) {
        return res.status(400).json({ error: "Amount must be greater than or equal to 1." });
    }
    if (!user_email) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    User.findOneAndUpdate({email: user_email, "profile.balances.balance_type": balance_type}, {
        $push: {
            "profile.expenses": {
                category,
                amount,
                date: Date.now(),
                description,
            }
        }, 
        $inc: {
            "profile.balances.$.amount": +amount,
        }
    }, {new: true}).then((updated_user) => {
        if (!updated_user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'Expense added successfully!' });
    }).catch (error => {
        console.error(error);
        res.status(500).json({ message: 'Error adding expense', error });
    });
});
app.post("/add-balance", (req, res) => {
    const { balance_type, category, description, amount } = req.body;
    const user_email = req.cookies.user_email;

    if (amount < 1) {
        return res.status(400).json({ error: "Amount must be greater than or equal to 1." });
    }

    if (!user_email) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    User.findOne({ email: user_email }).then((user) => {
        if (!user) return res.status(404).json({ message: 'User not found' });

        const mainBalance = user.profile.balances.find(b => b.balance_type === "Main Balance");

        if (!mainBalance || mainBalance.amount < amount) {
            return res.status(400).json({ error: 'Insufficient funds in Main Balance.' });
        }

        // First decrement the main balance
        const updatedBalances = user.profile.balances.map(b => {
            if (b.balance_type === "Main Balance") {
                b.amount -= amount;
            }
            return b;
        });

        // Then add the new balance entry (or update existing one if it exists)
        const existingBalance = user.profile.balances.find(b => b.balance_type === balance_type);
        if (existingBalance) {
            existingBalance.amount += amount;
        } else {
            updatedBalances.push({
                balance_type,
                amount
            });
        }

        // Add the expense entry
        const updatedExpenses = [...user.profile.expenses, {
            category,
            amount,
            date: Date.now(),
            description
        }];

        // Update the user with new balances and expenses
        User.findOneAndUpdate(
            { email: user_email },
            {
                "profile.balances": updatedBalances,
                "profile.expenses": updatedExpenses
            },
            { new: true }
        ).then(updated_user => {
            if (!updated_user) return res.status(404).json({ message: 'User not found' });
            res.status(200).json({ message: 'Balance and expense added successfully!' });
        }).catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Error adding balance or expense', error });
        });
    }).catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving user', error });
    });
});
app.post("/add-goal", (req, res) => {
    const {description, goal_type, target_amount, goal_progress, due_date} = req.body;
    user_email = req.cookies.user_email;
    if (amount < 1) {
        return res.status(400).json({ error: "Amount must be greater than or equal to 1." });
    }
    if (!user_email) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    User.findOneAndUpdate({email: user_email}, {
        $push: {
            "profile.goals": {
                description,
                goal_type,
                target_amount,
                goal_progress,
                due_date,
            }
        }, 
    }, {new: true}).then((updated_user) => {
        if (!updated_user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'Goal added successfully!' });
    }).catch (error => {
        console.error(error);
        res.status(500).json({ message: 'Error adding goal', error });
    });
});
app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);});
