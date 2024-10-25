import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
    const [user, setUser] = useState(null);
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [new_password, setNewPassword] = useState("");
    const [confirm_new_password, setConfirmNewPassword] = useState("");
    const [current_password, setCurrentPassword] = useState("");
    const [errors, setError] = useState({});

    useEffect(() => {
        fetch("http://localhost:5000/user", {
            method: 'GET',
            credentials: 'include'
        }).then((response) => response.json()).then((data) => {
            if (data.user) {
                setUser(data.user);
                setFirstName(data.user.profile.first_name);
                setLastName(data.user.profile.last_name);
                setEmail(data.user.email);
            }
         else {
            setError({"server_error": data.message});
         }
        }).catch((err) => {
            setError({"server_error": "Error fetching user."});
        });
    }, []);

    const handleName = (setter) => (e) => {
        let name_errors = {...errors};
        const value = e.target.value;
        const regex = /^[a-zA-Z]*$/;
        if (regex.test(value)) {
            const cap_value = value.charAt(0).toUpperCase() + value.slice(1);
            setter(cap_value);
            delete name_errors.name;
        }
        else {
            name_errors.name = "Names can only contain alphabet characters.";
        }
        setError(name_errors);
    };

    const handleEmail = (setter) => (e) => {
        let email_errors = {...errors};
        const value = e.target.value;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (regex.test(value)) {
            delete email_errors.email;
        }
        else {
            email_errors.email = "Please enter a valid email address.";
        }
        if (!value) {
            delete email_errors.email;
        }
        setter(value);
        setError(email_errors);
    };

    const handlePassword = (setter) => (e) => {
        let password_errors = {...errors};
        const value = e.target.value;
        if (value) {
            const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
        if (value.length < 8 || value.length > 20 || !regex.test(value)) {
            password_errors.new_password = "Password must be 8-20 characters long, include one uppercase letter, one number, and one special symbol.";
        }
        else {
            delete password_errors.new_password;
        }
    }
    else {
        delete password_errors.new_password;
    }
        setter(value);
        setError(password_errors);
    };

    const handleConfirmPassword = (setter) => (e) => {
        let password_errors = {...errors}
        const value = e.target.value;
        setter(value);
        if (value !== new_password && value) {
            password_errors.confirm_password = "Passwords do not match.";
        }
        else {
            delete password_errors.confirm_password;
        }
        setError(password_errors);
    };

    return (
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
            <main className="container">
            <h1 className="bg-primary text-white text-center p-4">Update Profile</h1>
            <form className="bg-light p-5 rounded shadow" style={{ maxWidth: '500px', margin: 'auto' }}>
                <div className='mb-3'>
                    <label htmlFor='first-name'>First Name</label>
                    <input
                    type='text'
                    id='first-name'
                    className='form-control'
                    value={first_name}
                    onChange={handleName(setFirstName)}
                    autoFocus
                    />
                    {errors.name && <div className="text-danger" role="alert">{errors.name}</div>}
                </div>
                <div className='mb-3'>
                    <label htmlFor='last-name'>Last Name</label>
                    <input
                    type='text'
                    id='last-name'
                    className='form-control'
                    value={last_name}
                    onChange={handleName(setLastName)}
                    />
                    {errors.name && <div className="text-danger" role="alert">{errors.name}</div>}
                </div>
                <div className='mb-3'>
                    <label htmlFor='email'>Email</label>
                    <input
                    type='email'
                    id='email'
                    className='form-control'
                    value={email}
                    onChange={handleEmail(setEmail)}
                    />
                    {errors.email && <div className="text-danger" role="alert">{errors.email}</div>}
                </div>
                <div className='mb-3'>
                    <label htmlFor='new-password'>New Password</label>
                    <input
                    type='password'
                    id='new-password'
                    className='form-control'
                    value={new_password}
                    onChange={handlePassword(setNewPassword)}
                    />
                    {errors.new_password && <div className="text-danger" role="alert">{errors.new_password}</div>}
                </div>
                <div className='mb-3'>
                    <label htmlFor='confirm-password'>Confirm New Password</label>
                    <input
                    type='password'
                    id='confirm-password'
                    className='form-control'
                    value={confirm_new_password}
                    onChange={handleConfirmPassword(setConfirmNewPassword)}
                    />
                    {errors.confirm_password && <div className="text-danger" role="alert">{errors.confirm_password}</div>}
                </div>
                <div className='mb-3'>
                    <label htmlFor='current-password'>Before making any changes, enter your current password.</label>
                    <input
                    type='password'
                    id='current-password'
                    className='form-control'
                    value={current_password}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={Object.keys(errors).length != 0}>Update Profile</button>
            </form>
            <button className="btn btn-primary w-100">Delete Account</button>
            </main>
        </div>
    );
};
export default UpdateProfile;