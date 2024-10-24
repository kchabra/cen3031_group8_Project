import 'bootstrap/dist/css/bootstrap.min.css';
    import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

const GoalPage = () => {
    const [goals, setGoals] = useState([]);
    const [description, setDescription] = useState("");
    const [goal_type, setGoalType] = useState("");
    const [target_amount, setTargetAmount] = useState(0);
    const [goal_progress, setGoalProgress] = useState(0);
    const [due_date, setDueDate] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/get-goals", {
            method: 'GET',
            credentials: 'include'
        }).then((response) => response.json()).then((data) => {
            if(data.goals) {
                setGoals(data.goals);
            }
            else if (data.message) {
                setError(data.message);
            }
        }).catch((err) => {
            setError("Error fetching goals.");
        });
    }, []);

    const handleAddGoal = async () => {
        if (target_amount < 1) {
            setError("Target amount to low.");
            return;
        }
        const data = {
            description: description,
            goal_type: goal_type,
            target_amount: target_amount,
            goal_progress: goal_progress,
            due_date: due_date
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

    return (
        <div className='container-fluid'>
            <button className="btn btn-secondary" onClick={() => navigate('/profile')}>Back</button>
            <h1 className="text-center mb-4">Goals</h1>
            <p>Add or view your goals here.</p>
            {error &&<p className="text-danger">{error}</p>}
            <button>Add Goal</button>
            <main>
                {goals.length === 0 ? (
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
                            <th>Target Amount</th>
                            <th>Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {goals.map((goal, index) => (
                                <tr key={index}>
                                    <td>{goal.goal_type}</td>
                                    <td>{goal.description}</td>
                                    <td>${goal.target_amount}</td>
                                    <td>
                                        <progress/>
                                    </td>
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