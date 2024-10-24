import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const AddExpense = () => {
    const [profile, setProfile] = useState(null);
    const [is_update_balance, setIsUpdateBalance] = useState(true);
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState("");
    const [selected_balance, setSelectedBalance] = useState("");
    const [balance_name, setBalanceName] = useState("");
    const [show_new_balance_input, setShowNewBalanceInput] = useState(false);
    const [error, setError] = useState("");
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
        if (amount < 1) {//check if amount is less than 1 and give error before submission. If this is the case, return to prevent submission.
            setError('Error: Amount must be greater than or equal to 1.');
            return;
        }
        let url;
        let data;
        if(is_update_balance) {
            if (show_new_balance_input) {
                if (!balance_name) {
                    setError("Error: Balance name cannot be empty.");
                    return;
                }
                url = "http://localhost:5000/add-balance";
                data = {
                    balance_type: balance_name,
                    category: "Transfer",
                    description: `Transfer from main balance to ${balance_name}.`,
                                        amount: amount
                };

            }
            else {
                url = "http://localhost:5000/update-balance";
                data = {
                    balance_type: selected_balance,
                    category: "Income",
                    amount: amount,
                    description: "Update to balance",
                    date: new Date()
                };
            }
        }
        else {
            url = "http://localhost:5000/add-expense";
            data = {
                category: category,
                amount: amount,
                description: description,
                date: new Date()
            };
        }
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
                setBalanceName("");
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
                <label htmlFor="balance-dropdown">Select Balance:</label>
                <select
                className='form-control"'
                id="balance-dropdown"
                value={selected_balance}
                onChange={(e) => {
                    const selected = e.target.value;
                    setSelectedBalance(selected);
                    setShowNewBalanceInput(selected === "add-new");
                }}
                >
                    <option value="">-- Select Balance --</option>
                    {profile && profile.balances.map((balance, index) => (
                        <option key={index} value={balance.balance_type}>{balance.balance_type}</option>
                    ))}
                    <option value="add-new">Add New Balance</option>
                </select>
                {show_new_balance_input && (
                    <div>
                        <label htmlFor="new-balance-name">New Balance Name:</label>
                        <input
                        type="text"
                        id="new-balance-name"
                        className="form-control"
                        value={balance_name}
                        onChange={(e) => setBalanceName(e.target.value)}
                        required
                        />
                        </div>
                )}
                <label htmlFor="balance">Amount:</label>
                <input
                type="number"
                id="balance"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                />
                <button className="btn btn-primary mt-3" onClick={handleSubmit}>{show_new_balance_input ? 'Add New Balance' : 'Update Balance'}</button>
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