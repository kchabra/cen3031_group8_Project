const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        first_name: {//require for onboarding
            type: String,
            default: ""
        },
        last_name: { //require for onboarding
            type: String,
            default: ""
        },
        balances: [{//Main balance, emergency fund, savings, etc
            balance_type: {
                type: String,
                default: ""
            },
            amount: {
                type: Number,
                default: 0
            }
        }],
        budget: { //object to hold info about the budget; amount and when it was set.
        amount: {//How much they should spend per month; default is 0; optional for onboarding
            type: Number,
            default: 0
        },
        last_set: {
            type: Date,
            default: Date.now
        }
    },
        expenses: [{ //object array to hold expenses
            category: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            date: {//Date.now fetches the current date
                type: Date,
                default: Date.now
            },
            description: {
                type: String,
                required: true
            }
        }],
        goals: [{ //object array to hold user goals
            description: {//All goals should require a description
                type: String,
                required: true
            },
            goal_type: {//what type of goal is this? Is it a savings goal, reducing spending goal, or some other type of goal? Goal_type can be used to add functionality to specific predefined goal types.
                type: String,
                required: true
            },
                current_amount: {//Currentamount for the goal.
                type: Number,
                default: 0
            },
            target_amount: {//Goal target amount
                type: Number,
                required: true
            },
            due_date: {//Optional if the user wishes to supply this
                type: Date,
            }
        }]
    }

},{timestamps:true})

const User = mongoose.model('User',userSchema);
module.exports = User;