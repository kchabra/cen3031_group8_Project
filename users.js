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
            required: true
        },
        last_name: { //require for onboarding
            type: String,
            required: true
        },
        current_amount: {//Current balance; required for onboarding
            type: Number,
            required: true
        },
        monthly_budget: {//How much they should spend per month; default is 0; optional for onboarding
            type: Number,
            default: 0
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
            target_amount: {//Goal target amount
                type: Number,
                required: true
            },
            goal_Profress_amount: {//Progress amount towards goal. Will start at 0.
                type: number,
                default: 0
            },
            due_date: {//Optional if the user wishes to supply this
                type: Date,
            }
        }]
    }

},{timestamps:true})

const User = mongoose.model('User',userSchema);
module.exports = User;