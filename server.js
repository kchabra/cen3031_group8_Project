const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const user = require('./users');
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
app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);});

app.get('add-user',(req,res) =>{
    const User = new user({
        email:  'abc123@gmail.com',
        username: 'a1b2c3',
        password: '123456'
    });
    User.save()
        .then((result) =>{
        res.send(result)
    })
        .catch((err) => {
            console.log(err);
        })
})