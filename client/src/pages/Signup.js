import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
    return (
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
            <main className="container">
            <h1 className="bg-primary text-white text-center p-4">Sign Up</h1>
            <form className="bg-light p-5 rounded shadow" style={{ maxWidth: '500px', margin: 'auto' }}>
            <div className="mb-3">
                <label htmlFor="fname" classname="form-label">First Name:</label>
                <input type="text" name="fname" id="fname" className="form-control" required />
            </div>
            <div className="mb-3">
                <label htmlFor="lname" className="form-label">Last Name:</label>
                <input type="text" name="lname" id="lname" className="form-control" required />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <input type="email" name="email" id="email" className="form-control" required />
            </div>
            <div className="mb-3">
                <label htmlFor="uname" className="form-label">User Name:</label>
                <input type="text" name="uname" id="uname" className="form-control" required />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password:</label>
                <input type="password" name="password" id="password" className="form-control" required />
            </div>
            <div className="mb-3">
                <label htmlFor="confirmpassword" className="form-label">Confirm Password:</label>
                <input type="password" name="confirmpassword" id="confirmpassword" className="form-control" required />
        </div>
            <button type="submit" className="btn btn-primary w-100">Create Account</button>
            </form>
            </main>
        </div>
    );
};

export default Signup;