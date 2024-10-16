import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember_me, setRememberMe] = useState(false);
    const [error_message, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {email, password, remember_me});
            if (response.status === 200) {
                navigate('/profile');
            }
            else {
                setErrorMessage('Invalid email or password.');
            }
        }
        catch (error) {
            console.error('Login error', error);
            setErrorMessage('Login error: Invalid email or password.');
        }
    };

    return (
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
            <main className="container">
            <h1 className="bg-success text-white text-center p-5">
                LOGIN
            </h1>
            <form className="bg-light p-4 rounded shadow" style={{ width: '300px' }} onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="email" classname="form-label">Email: </label>
                <input type="email" id="email" name="email" className="form-control" value={email} onChange={(e)=> setEmail(e.target.value)} required/>
                </div>
                <div className="mb-3">
                <label htmlFor="password" classname="form-label">Password: </label>
                <input type="password" id="password" name="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <div className="form-check mb-3">
                    <input type="checkbox" id="remember-me" className="form-check-input" hecked={remember_me} onChange={(e) => setRememberMe(e.target.checked)}/>
                    <label htmlFor="remember-me" className="form-check-label">remember Me</label>
                </div>
                {error_message && (<div className="alert alert-danger" role="alert">{error_message}</div>)}
                <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
            </main>
            </div>
    );
};

export default Login;