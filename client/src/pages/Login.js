import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    return (
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
            <main className="container">
            <h1 className="bg-success text-white text-center p-5">
                LOGIN
            </h1>
            <form className="bg-light p-4 rounded shadow" style={{ width: '300px' }}>
            <div className="mb-3">
                <label htmlFor="Uname" classname="form-label">Username: </label>
                <input type="text" id="Uname" name="Uname" className="form-control" 
                            required/>
                </div>
                <div className="mb-3">
                <label htmlFor="Pass" classname="form-label">Password: </label>
                <input type="text" id="Pass" name="Pass" className="form-control" required/>
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
            </main>
            </div>
    );
};

export default Login;