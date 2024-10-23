import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

const AddExpense = () => {
    const [is_update_balance, setIsUpdateBalance] = useState(true);
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async () => {
        if (amount < 1) {//check if amount is less than 1 and give error before submission. If this is the case, return to prevent submission.
            setError('Error: Amount must be greater than or equal to 1.');
            return;
        }
        const url = is_update_balance ? "http://localhost:5000/update-balance" : "http://localhost:5000/add-expense";
        const data = is_update_balance ? {
            category: "Income",
            amount: amount,
            description: "Update to balance",
            date: new Date()
        } : {
            category: category,
            amount: amount,
            description: description,
            date: new Date()
        };
        try {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include', // Important to send cookies with the request
                                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                setError(is_update_balance ? 'Balance updated successfully!' : 'Expense added successfully!');
                //clear the form fields after submission.
                setCategory("");
                setAmount(0);
                setDescription("");
            }
            else {
                setError('Error: Could not update balance or add expense');
            }
        }
        catch (error) {
            console.error('Error:', error);
            setError('Failed to process the request.');
        }
    };
    return (
        <main className="container mt-5">
            <button className="btn btn-secondary" onClick={() => navigate('/profile')}>Back</button>
            <h1 className="text-center mb-4">Add expense or update balance</h1>
            {error && <div role="alert" className="alert alert-danger">{error}</div>} {/* Display error message */}
            <div className="form-group">
            <label>Do you wish to:</label>
            <div>
                <input
                type="radio"
                id="update-balance"
                name="option"
                value="Add to Balance"
                checked={is_update_balance}
                onChange={() => setIsUpdateBalance(true)}
                />
                <label htmlFor="update-balance">Add to Balance</label>
            </div>
            <div>
            <input
                type="radio"
                id="add-expense"
                name="option"
                value="Add an Expense"
                checked={!is_update_balance}
                onChange={() => setIsUpdateBalance(false)}
                />
                <label htmlFor="add-expense">Add an Expense</label>
            </div>
            </div>
            {/* Conditional rendering based on user selection */}
            {is_update_balance ? (//User wants to update balance.
            <div className="form-group">
                <label htmlFor="balance">Amount:</label>
                <input
                type="number"
                id="balance"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                />
                <button className="btn btn-primary mt-3" onClick={handleSubmit}>Update Balance</button>
            </div>
            ) : (//User wants to add expense.
                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <input
                    type="text"
                    id="category"
                    className='form-control'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    />
                    <label htmlFor="amount">Amount:</label>
                    <input
                    type="number"
                    id="amount"
                    className='form-control'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    />
                    <label htmlFor="description">Description:</label>
                    <input
                    type="text"
                    id="description"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    />
                    <button className="btn btn-primary mt-3" onClick={handleSubmit}>Add Expense</button>
                </div>
            )
        }
    </main>
    );
};
export default AddExpense;