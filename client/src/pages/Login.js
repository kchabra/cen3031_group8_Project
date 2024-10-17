import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error_message, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {email, password, rememberMe});
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
            <form className="bg-light p-5 rounded shadow" style={{ maxWidth: '500px', margin: 'auto' }} onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email: </label>
                <input type="email" id="email" name="email" className="form-control" value={email} onChange={(e)=> setEmail(e.target.value)} required autoFocus/>
                </div>
                <div className="mb-3">
                <label htmlFor="password" className="form-label">Password: </label>
                <input type="password" id="password" name="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <div className="form-check mb-3">
                    <input type="checkbox" id="remember-me" className="form-check-input" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}/>
                    <label htmlFor="remember-me" className="form-check-label">Remember Me</label>
                </div>
                {error_message && (<div className="alert alert-danger" role="alert">{error_message}</div>)}
                <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
            </main>
            </div>
    );
};

export default Login;