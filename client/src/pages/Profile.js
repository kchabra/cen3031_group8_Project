import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';

const Profile_component = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [current_balance, setCurrentBalance] = useState(0);
    const [monthly_budget, setMonthlyBudget] = useState(0);
    const [new_monthly_budget, resetMonthlyBudget] = useState(0);
    const [name_error, setNameError] = useState("");
    const [new_income, addToBalance] = useState(0);
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
    const handleNameChange = (setter) => (e) => {
        const value = e.target.value;
        const regex = /^[a-zA-Z]*$/; // Only alphabetic characters
        if (regex.test(value)) {
            const capatilized_value = value.charAt(0).toUpperCase() + value.slice(1); //create and force the input box to have new capatilized value
            setter(capatilized_value);
            setNameError("");
        }
        else {
            setNameError("Names can only contain alphabet characters.");
        }
    };
    const handleOnboardingSubmit = async (e) => {
        e.preventDefault();
        //Onboarding data to be sent to backend.
        const onboarding_data = {
            first_name: first_name,
            last_name: last_name,
            current_balance: current_balance,
            budget: {
                amount: monthly_budget
            }
        };
        try {//Let's try to send the data
            const response = await fetch('http://localhost:5000/onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Send cookies with the request
                body: JSON.stringify(onboarding_data),
            });
            if (response.ok) {
                //Response is good and has been sent; refresh the profile.
                setProfile(onboarding_data);
            }
            else {
                //Error has appeared.
                setError("Error updating profile.");
            }
    }
    catch (error) {
        setError("Error submitting onboarding data.");
    }
};
return (
    <div className="container">
            {/*This page will be based on conditions. If an error is present, the error will display. If there is no first name, the onboarding page will display. Otherwise the profile will display.*/}
            {error ? (//There is an error
                <p className="text-danger">{error}</p>
            ) : profile ? (//No error; profile data is present.
             profile.first_name ? (//Profile has first name; display the profile. You might want to use a separate component that you would insert below or you can add the whole profile below.
                <main>
                    <h1>Welcome, {profile.first_name}!</h1>
                    <h2>Your current balance is ${current_balance}</h2>
                    <h2>Your montly budget is set to ${monthly_budget}</h2>
                    <div className='reset budget'>
                        <label htmlFor='monthly-budget' className='update-value'>What will be your new budget for this month?</label>
                        <input
                        type="number"
                        id='monthly-budget'
                        className='update-value'
                        value={new_monthly_budget}
                        onChange={(e) => resetMonthlyBudget(e.target.value)}
                        required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" 
                    onClick={() => setMonthlyBudget(new_monthly_budget)}>
                    Update budget</button>
                    <div className='Add to balance'>
                        <label htmlFor='current-balance' className='update-value'>Add to balance</label>
                        <input
                        type="number"
                        id='current-balance'
                        className='update-value'
                        value={new_income}
                        onChange={(e) => addToBalance(e.target.value)}
                        required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" 
                    onClick={() => setCurrentBalance(parseFloat(current_balance) + parseFloat(new_income))}>
                    Add income</button>
                    <p>More updates are coming soon.</p>
                </main>
             ) : (//First name not present. Onboarding is below.
                <main className="mt-5">
                    <h1>Welcome! Let's get started with your profile so you can start saving big.</h1>
                    <form className="bg-light p-4 rounded shadow" onSubmit={handleOnboardingSubmit}>
                    <div className="mb-3">
                        <label htmlFor="first-name" className="form-label">First Name</label>
                        <input
                        type="text"
                        id="first-name"
                        className='form-control'
                        value={first_name}
                        onChange={handleNameChange(setFirstName)}
                        required
                        autoFocus
                        />
                    </div>
                    <div className='mb3'>
                        <label htmlFor='last-name' className='form-label'>Last Name</label>
                        <input
                        type="text"
                        id="last-name"
                        className='form-control'
                        value={last_name}
                        onChange={handleNameChange(setLastName)}
                        required
                        />
                        {name_error && <p className="text-danger" role="alert">{name_error}</p>}
                    </div>
                    <div className='mb3'>
                        <label htmlFor='current-balance' className='form-label'>What is your current balance?</label>
                        <input
                        type="number"
                        id="current-balance"
                        className='form-control'
                        value={current_balance}
                        onChange={(e) => setCurrentBalance(e.target.value)}
                        required
                        />
                        
                    </div>
                    <div className='mb3'>
                        <label htmlFor='monthly-budget' className='form-label'>What will be your budget for this month?</label>
                        <input
                        type="number"
                        id='monthly-budget'
                        className='form-control'
                        value={monthly_budget}
                        onChange={(e) => setMonthlyBudget(e.target.value)}
                        required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Update Profile</button>
                    </form>
                </main>
             )
                ) : (//First name is present.
                    <p>Loading profile...</p>
            )}
                    </div>
        
    );
};

export default Profile_component;
