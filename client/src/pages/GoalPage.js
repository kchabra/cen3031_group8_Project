import 'bootstrap/dist/css/bootstrap.min.css';
    import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

const GoalPage = () => {
    const [profile, setProfile] = useState(null);
    const [description, setDescription] = useState("");
    const [goal_type, setGoalType] = useState("");
    const [target_amount, setTargetAmount] = useState(0);
    const [due_date, setDueDate] = useState("");
    const [error, setError] = useState("");
    const [show_modal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/profile", {
            method: 'GET',
            credentials: 'include'
        }).then((response) => response.json()).then((data) => {
            if(data.profile) {
                setProfile(data.profile);
            }
            else if (data.message) {
                setError(data.message);
            }
        }).catch((err) => {
            setError("Error fetching goals.");
        });
    }, [profile]);

    const handleAddGoal = async () => {
        if (target_amount < 1) {
            setError("Target amount to low.");
            return;
        }
        let formatted_due_date = null;
        if (due_date) {
            const date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
             if (!date_regex.test(due_date)) {
                setError("Invalid date format. Please use mm/dd/yyyy.");
                return;
             }
             const [month, day, year] = due_date.split('/');
             formatted_due_date = new Date(`${year}-${month}-${day}`);
             if (isNaN(formatted_due_date.getTime())) {
                setError("Invalid date value.");
                return;
             }
        }
        const data = {
            description: description,
            goal_type: goal_type,
            target_amount: target_amount,
            due_date: formatted_due_date ? formatted_due_date : due_date
        };
        try {
            const response = await fetch("http://localhost:5000/add-goal", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                setError("Goal added sucessfully.");
                setDescription("");
                setGoalType("");
                setTargetAmount(0);
                setDueDate("");
                setShowModal(false);
                    }
            else {
                setError("Unable to add goal.");
            }
        }
        catch (error) {
            console.error('Error:', error);
            setError('Failed to process the request.');
        }
    };

    const removeGoal = async (id) => {
        try {
            const response = fetch("http://localhost:5000/remove-goal", {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id})
            });
            if ((await response).ok) {
                setProfile((prev_profile) => ({
                    ...prev_profile,
                    goals: prev_profile.goals.filter((goal) => goal.id !== id),
                }));
            }
            else {
                const data = (await response).json();
                setError(data.message || "Error removing goal.");
            }
        }
        catch (error) {
            console.error("Error:", error);
            setError("Failed to process the request.");
        }
    };

const handleDueDateChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9/]/g, '');
    if (value.length === 2 || value.length === 5) {
        if (!value.endsWith('/')) {
            value += '/';
        }
    }
    if (value.length > 10) {
        value = value.slice(0, 10)
    }
    setDueDate(value);
};
    return (
        <div className='container-fluid'>
            <button className="btn btn-secondary" onClick={() => navigate('/profile')}>Back</button>
            <h1 className="text-center mb-4">Goals</h1>
            <p>Add or view your goals here.</p>
            {error &&<p className="text-danger">{error}</p>}
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add Goal</button>
            {show_modal && (
                <div className="modal show" style={{ display: "block" }}>
                    <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title">Add New Goal</h5>
                    <button type="button" className="close" onClick={() => setShowModal(false)}>Close</button>
                    </div>
                    <div className="modal-body">
                        <div className='form-group'>
                        <label htmlFor='goal-type'>Goal Type</label>
                            <select
                                type="text"
                                id='goal-type'
                                className='form-control'
                                value={goal_type}
                                onChange={(e) => setGoalType(e.target.value)}
                                required
                                autofocus
                            >
                                <option value="">-- Select Goal Type --</option>
                                <option value="savings">Savings</option>
                                <option value="spending">Spending</option>
                                </select>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='description'>Description</label>
                            <input
                                type="text"
                                id='description'
                                className='form-control'
                                value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        />
                        </div>
                        <div className='form-group'>
                        <label htmlFor='target-amount'>Target Amount</label>
                        <input
                        type='number'
                        id='target-amount'
                        className='form-control'
                        value={target_amount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        required
                        />
                        </div>
                        <div className='form-group'>
                        <label htmlFor='date'>Due Date (Optional)</label>
                        <input
                        type="text"
                        id='date'
                        className='form-control'
                        value={due_date}
                        placeholder="mm/dd/yyyy"
                        onChange={handleDueDateChange}
                        maxLength="10"
                        />
                        </div>
                    </div>
                    <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={handleAddGoal} disabled={goal_type === ""}>Add Goal</button>
                    </div>
                    </div>
                    </div>
                </div>
            )}
            <main>
                {profile && profile.goals.length === 0 ? (
                    <h1>
                        <p>There are no goals to show here.</p>
                    <p>Click the "Add Goal" button to add a goal.</p>
                    </h1>
                ) : (
                    <table>
                        <thead>
                            <tr>
                            <th>Goal Type</th>
                            <th>Description</th>
                            <th>Current Amount Towards Goal</th>
                            <th>Target Amount</th>
                            <th>Progress</th>
                            <th>Due Date</th>
                            <th>Completed Goal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profile && profile.goals.map((goal, index) => (
                                <tr key={index}>
                                    <td>{goal.goal_type}</td>
                                    <td>{goal.description}</td>
                                    <td>${goal.current_amount}</td>
                                    <td>${goal.target_amount}</td>
                                    <td>
                                        <progress
                                        value={goal.current_amount}
                                        max={goal.target_amount}
                                        style={{ width: '100%' }}
                                        />
                                        <span>{goal.target_amount > 0 ? Math.round((goal.current_amount / goal.target_amount) * 100) : 0}%</span>
                                    </td>
                                    <td>{goal.due_date ? new Date(goal.due_date).toLocaleDateString('en-US', {timeZone: 'UTC'}) : 'No Due Date'}</td>
                                    <td><button className="btn btn-danger" onClick={() => removeGoal(goal.id)}>Complete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
};
export default GoalPage;
