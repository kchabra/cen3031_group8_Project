import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const AddExpense = () => {
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [profile, setProfile] = useState(null);
    const [selected_goal, setGoalSelected] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/profile', {
            method: 'GET',
            credentials: 'include', // Important to send cookies with the request
        }).then((response) => response.json()).then((data) => {
            if (data.profile) {
                setProfile(data.profile);
            }
            else if (data.message) {
                setError(data.message);
            }
        }).catch((err) => {
            setError("Error fetching profile.");

        });
    }, []);

    const handleSubmit = async () => {
            const data = {
                category: category,
                amount: amount,
                description: description,
                date: new Date()
            };
        try {
            const response = await fetch("http://localhost:5000/add-expense", {
                method: 'POST',
                credentials: 'include', // Important to send cookies with the request
                                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                setError('Expense added successfully!');
                //clear the form fields after submission.
                setCategory("");
                setAmount(0);
                setDescription("");
                setGoalSelected("");
            }
            else {
                setError('Error: Could not update balance or add expense');
            }
        }
        catch (error) {
            console.error('Error:', error);
            setError('Failed to process the request.');
        }
        if(selected_goal){
            try {
                const response = await fetch("http://localhost:5000/update-goals", {
                    method: 'POST',
                    credentials: 'include', // Important to send cookies with the request
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        goal: selected_goal,
                        amountGoal: amount
                    }),
                });
                if (response.ok) {
                    setError('Goal updated successfully!');
                    //clear the form fields after submission.
                    setAmount(0);
                    setCategory("");
                    setGoalSelected("");
                }
                else {
                    setError('Error: Could not update balance and goals');
                }
            }
            catch (error) {
                console.error('Error:', error);
                setError('Failed to process the request.');
            }
        }
    };

    return (
        <main className="container mt-5">
            <button className="btn btn-secondary" onClick={() => navigate('/profile')}>Back</button>
            <h1 className="text-center mb-4">Add expense</h1>
            {error && <div role="alert" className="alert alert-danger">{error}</div>}
            <p>All expenses remove amounts from the "main balance" balance.</p>
                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <input
                    type="text"
                    id="category"
                    className='form-control'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    autoFocus
                    />
                    <div>
                    <label htmlFor="amount">Amount:</label>
                    <input
                    type="number"
                    id="amount"
                    className='form-control'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    />
                    </div>
                    <div>
                    <label htmlFor="description">Description:</label>
                    <input
                    type="text"
                    id="description"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    />
                    </div>
                    <div>
                <label htmlFor="goal-dropdown">Do you wish to apply the balance update to a goal? (Optional):</label>
                <select
                    className='form-control"'
                    id="goal-dropdown"
                    value={selected_goal}
                    onChange={(e) => {
                        const selected_g = e.target.value;
                        setGoalSelected(selected_g);
                    }}
                >
                    <option value="">No</option>
                    {profile && profile.goals.filter((goal) => goal.goal_type === "spending").map((goal, index) => (
                        <option key={index} value={goal.description}>{goal.description}</option>
                    ))}
                </select>
                </div>
                    <button className="btn btn-primary mt-3" onClick={handleSubmit}>Add Expense</button>
                </div>
    </main>
    );
};
export default AddExpense;