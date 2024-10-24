import 'bootstrap/dist/css/bootstrap.min.css';
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';

const AddExpense = () => {
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
    </main>
    );
};
export default AddExpense;